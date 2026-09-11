import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ConfigService } from "@nestjs/config";
import { Model } from "mongoose";
import * as crypto from "crypto";
import Razorpay from "razorpay";
import { Order, OrderStatus, type OrderDocument } from "./schemas/order.schema";
import { CoursesService } from "../courses/courses.service";
import { CourseStatus } from "../courses/schemas/course.schema";
import { EnrollmentsService } from "../enrollments/enrollments.service";
import type { CreateOrderDto } from "./dto/create-order.dto";
import type { VerifyPaymentDto } from "./dto/verify-payment.dto";

@Injectable()
export class OrdersService {
  private razorpay: Razorpay | null = null;

  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    private readonly coursesService: CoursesService,
    private readonly enrollmentsService: EnrollmentsService,
    private readonly configService: ConfigService,
  ) {}

  private getRazorpay(): Razorpay {
    const keyId = this.configService.get<string>("RAZORPAY_KEY_ID");
    const keySecret = this.configService.get<string>("RAZORPAY_KEY_SECRET");

    if (!keyId || !keySecret) {
      throw new ServiceUnavailableException(
        "Payment gateway is not configured yet. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to server/.env.",
      );
    }

    if (!this.razorpay) {
      this.razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
    }
    return this.razorpay;
  }

  async createOrder(userId: string, dto: CreateOrderDto) {
    const uniqueCourseIds = [...new Set(dto.courseIds)];

    const courses = await Promise.all(
      uniqueCourseIds.map((id) => this.coursesService.findByIdOrThrow(id)),
    );

    for (const course of courses) {
      if (course.status !== CourseStatus.PUBLISHED) {
        throw new BadRequestException(`"${course.title}" is not currently available.`);
      }
      if (await this.enrollmentsService.isEnrolled(userId, course._id.toString())) {
        throw new BadRequestException(`You're already enrolled in "${course.title}".`);
      }
    }

    const currencies = new Set(courses.map((c) => c.currency));
    if (currencies.size > 1) {
      throw new BadRequestException(
        "All courses in one order must use the same currency. Checkout them separately.",
      );
    }

    const items = courses.map((course) => ({
      course: course._id,
      title: course.title,
      price: course.salePrice ?? course.price,
    }));

    const subtotal = items.reduce((sum, item) => sum + item.price, 0);
    if (subtotal <= 0) {
      throw new BadRequestException(
        "This checkout is for paid courses only — free courses can be enrolled directly.",
      );
    }

    const order = await this.orderModel.create({
      user: userId,
      items,
      billingInfo: dto.billingInfo,
      subtotal,
      total: subtotal,
      currency: courses[0].currency,
      status: OrderStatus.PENDING,
    });

    const razorpay = this.getRazorpay();
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(order.total * 100),
      currency: order.currency,
      receipt: order._id.toString(),
      notes: { orderId: order._id.toString(), userId },
    });

    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    return {
      orderId: order._id,
      razorpayOrderId: razorpayOrder.id,
      amount: order.total,
      currency: order.currency,
      keyId: this.configService.get<string>("RAZORPAY_KEY_ID"),
    };
  }

  async verifyPayment(userId: string, dto: VerifyPaymentDto) {
    const order = await this.orderModel.findById(dto.orderId).exec();
    if (!order || order.user.toString() !== userId) {
      throw new NotFoundException("Order not found.");
    }
    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException("This order has already been processed.");
    }
    if (order.razorpayOrderId !== dto.razorpay_order_id) {
      throw new BadRequestException("Order mismatch.");
    }

    const keySecret = this.configService.get<string>("RAZORPAY_KEY_SECRET");
    if (!keySecret) {
      throw new ServiceUnavailableException("Payment gateway is not configured yet.");
    }

    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${dto.razorpay_order_id}|${dto.razorpay_payment_id}`)
      .digest("hex");

    const isValid =
      expectedSignature.length === dto.razorpay_signature.length &&
      crypto.timingSafeEqual(
        Buffer.from(expectedSignature, "utf8"),
        Buffer.from(dto.razorpay_signature, "utf8"),
      );

    if (!isValid) {
      order.status = OrderStatus.FAILED;
      order.failureReason = "Signature verification failed.";
      await order.save();
      throw new BadRequestException("Payment verification failed.");
    }

    order.status = OrderStatus.PAID;
    order.razorpayPaymentId = dto.razorpay_payment_id;
    order.razorpaySignature = dto.razorpay_signature;
    order.paidAt = new Date();
    await order.save();

    await Promise.all(
      order.items.map((item) =>
        this.enrollmentsService.enrollFromOrder(userId, item.course.toString(), order._id),
      ),
    );

    return order;
  }

  async findByIdForAdmin(id: string) {
    const order = await this.orderModel
      .findById(id)
      .populate({ path: "user", select: "name email" })
      .exec();
    if (!order) throw new NotFoundException("Order not found.");
    return order;
  }

  async findByIdOrThrow(id: string, userId?: string) {
    const order = await this.orderModel.findById(id).exec();
    if (!order) throw new NotFoundException("Order not found.");
    if (userId && order.user.toString() !== userId) {
      throw new ForbiddenException("You do not have permission to view this order.");
    }
    return order;
  }

  findMine(userId: string) {
    return this.orderModel.find({ user: userId }).sort({ createdAt: -1 }).exec();
  }

  /** Admin listing — every order, newest first, with the buyer's name/email. */
  async findAllForAdmin(query: { status?: OrderStatus; page?: number; limit?: number }) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const filter = query.status ? { status: query.status } : {};

    const [items, total] = await Promise.all([
      this.orderModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate({ path: "user", select: "name email" })
        .exec(),
      this.orderModel.countDocuments(filter).exec(),
    ]);

    return {
      items,
      pagination: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) },
    };
  }
}
