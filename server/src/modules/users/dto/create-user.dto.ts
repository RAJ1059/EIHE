import { IsEmail, IsEnum, IsString, MaxLength, MinLength } from "class-validator";
import { Role } from "../../../common/enums/role.enum";

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8, { message: "Password must be at least 8 characters long" })
  @MaxLength(72)
  password!: string;

  @IsEnum(Role)
  role!: Role;
}
