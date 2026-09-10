import { Injectable, type NestInterceptor, type ExecutionContext, type CallHandler } from "@nestjs/common";
import type { Observable } from "rxjs";
import { map } from "rxjs/operators";

export interface ApiResponse<T> {
  success: true;
  message: string;
  data: T;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data) => ({
        success: true as const,
        message: this.resolveMessage(context),
        data,
      })),
    );
  }

  private resolveMessage(context: ExecutionContext): string {
    const request = context.switchToHttp().getRequest();
    switch (request.method) {
      case "POST":
        return "Created successfully";
      case "PUT":
      case "PATCH":
        return "Updated successfully";
      case "DELETE":
        return "Deleted successfully";
      default:
        return "Fetched successfully";
    }
  }
}
