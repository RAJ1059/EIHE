import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import type { Response } from "express";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const isHttpException = exception instanceof HttpException;
    const status = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const body = isHttpException ? exception.getResponse() : null;
    const message = this.extractMessage(body, exception);
    const errorCode = this.extractErrorCode(body, status);

    if (!isHttpException) {
      this.logger.error(exception instanceof Error ? exception.stack : exception);
    }

    response.status(status).json({
      success: false,
      message,
      errorCode,
    });
  }

  private extractMessage(body: unknown, exception: unknown): string {
    if (body && typeof body === "object" && "message" in body) {
      const raw = (body as { message: string | string[] }).message;
      return Array.isArray(raw) ? raw.join(", ") : raw;
    }
    if (exception instanceof Error) return exception.message;
    return "Something went wrong. Please try again.";
  }

  private extractErrorCode(body: unknown, status: number): string {
    if (body && typeof body === "object" && "error" in body) {
      const error = (body as { error: string }).error;
      return error.toUpperCase().replace(/\s+/g, "_");
    }
    return `HTTP_${status}`;
  }
}
