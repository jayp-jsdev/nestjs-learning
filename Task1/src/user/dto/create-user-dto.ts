import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  Validate,
} from 'class-validator';

export class CreateUserDTO {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsNotEmpty({ message: 'Please Add Username' })
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  role: string;

  @IsNotEmpty()
  @Matches(/^[A-Za-z0-9@#$%^&*!]{6,}$/, {
    message: 'Password must be at least 6 characters',
  })
  password: string;
}
