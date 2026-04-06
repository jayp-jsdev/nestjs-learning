import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';
import { Roles } from '../../constant/Roles';

export class CreateUserDTO {
  @IsNotEmpty({ message: 'Please Add Username' })
  @IsString()
  username!: string;

  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsNotEmpty()
  role!: Roles;

  @IsNotEmpty()
  @Matches(/^[A-Za-z0-9@#$%^&*!]{6,}$/, {
    message: 'Password must be at least 6 characters',
  })
  password!: string;
}
