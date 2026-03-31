import { IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDTO {
  @IsNotEmpty({ message: 'Please Enter Username' })
  @IsString()
  username: string;

  @IsNotEmpty({ message: 'Please Enter Password' })
  password: string;
}
