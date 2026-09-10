import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

/**
 * Like JwtAuthGuard, but never rejects the request — it just leaves
 * `req.user` unset when there's no (or an invalid) token. Used for
 * endpoints that are publicly viewable but personalize their response
 * (lock/completed state) for a logged-in viewer.
 */
@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard("jwt") {
  handleRequest<TUser = unknown>(_err: unknown, user: TUser): TUser {
    return user;
  }
}
