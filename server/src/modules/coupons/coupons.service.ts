import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Coupon, CouponDiscountType, type CouponDocument } from "./schemas/coupon.schema";
import type { CreateCouponDto } from "./dto/create-coupon.dto";

@Injectable()
export class CouponsService {
  constructor(@InjectModel(Coupon.name) private readonly couponModel: Model<CouponDocument>) {}

  async validateForOrder(rawCode: string, subtotal: number) {
    const code = rawCode.toUpperCase().trim();
    const coupon = await this.couponModel.findOne({ code }).exec();

    if (!coupon || !coupon.isActive) {
      throw new BadRequestException("This coupon code isn't valid.");
    }
    if (coupon.expiresAt && coupon.expiresAt.getTime() < Date.now()) {
      throw new BadRequestException("This coupon has expired.");
    }
    if (coupon.maxRedemptions !== null && coupon.timesRedeemed >= coupon.maxRedemptions) {
      throw new BadRequestException("This coupon has reached its usage limit.");
    }
    if (subtotal < coupon.minOrderAmount) {
      throw new BadRequestException(
        `This coupon requires a minimum order of ${coupon.minOrderAmount}.`,
      );
    }

    const rawDiscount =
      coupon.discountType === CouponDiscountType.PERCENT
        ? (subtotal * coupon.discountValue) / 100
        : coupon.discountValue;
    const discountAmount = Math.min(Math.round(rawDiscount * 100) / 100, subtotal);

    return { coupon, discountAmount };
  }

  async redeem(rawCode: string) {
    await this.couponModel
      .updateOne({ code: rawCode.toUpperCase().trim() }, { $inc: { timesRedeemed: 1 } })
      .exec();
  }

  async create(dto: CreateCouponDto) {
    const code = dto.code.toUpperCase().trim();
    const existing = await this.couponModel.findOne({ code }).exec();
    if (existing) throw new ConflictException("A coupon with this code already exists.");

    return this.couponModel.create({
      code,
      discountType: dto.discountType,
      discountValue: dto.discountValue,
      maxRedemptions: dto.maxRedemptions ?? null,
      expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
      minOrderAmount: dto.minOrderAmount ?? 0,
    });
  }

  findAll() {
    return this.couponModel.find().sort({ createdAt: -1 }).exec();
  }

  async setActive(id: string, isActive: boolean) {
    const coupon = await this.couponModel.findById(id).exec();
    if (!coupon) throw new NotFoundException("Coupon not found.");
    coupon.isActive = isActive;
    await coupon.save();
    return coupon;
  }

  async delete(id: string) {
    const result = await this.couponModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) throw new NotFoundException("Coupon not found.");
  }
}
