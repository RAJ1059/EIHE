import "reflect-metadata";
import * as dotenv from "dotenv";
import mongoose from "mongoose";
import * as bcrypt from "bcrypt";
import { UserSchema } from "../modules/users/schemas/user.schema";
import { Role } from "../common/enums/role.enum";

dotenv.config();

async function main() {
  const uri = process.env.MONGODB_URI;
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME ?? "EIHE Admin";

  if (!uri || !email || !password) {
    console.error(
      "Missing MONGODB_URI, ADMIN_EMAIL, or ADMIN_PASSWORD in server/.env — cannot seed admin.",
    );
    process.exit(1);
  }

  await mongoose.connect(uri);
  const UserModel = mongoose.model("User", UserSchema);

  const existing = await UserModel.findOne({ email: email.toLowerCase().trim() });
  if (existing) {
    console.log(`Admin already exists for ${email} (role: ${existing.role}). Nothing to do.`);
    await mongoose.disconnect();
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await UserModel.create({
    name,
    email: email.toLowerCase().trim(),
    passwordHash,
    role: Role.SUPER_ADMIN,
    isActive: true,
  });

  console.log(`Created SUPER_ADMIN user: ${email}`);
  await mongoose.disconnect();
}

main().catch((error) => {
  console.error("Failed to seed admin user:", error);
  process.exit(1);
});
