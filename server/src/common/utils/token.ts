import * as crypto from "crypto";

/** A random URL-safe token for one-time links (password reset, email
 * verification) — sent to the user raw, never stored raw. */
export function generateSecureToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

/** Deterministic (sha256, not bcrypt) so a token from a link can be looked
 * up by re-hashing and querying for equality — bcrypt's per-hash salt
 * would make that impossible without iterating every candidate row. */
export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}
