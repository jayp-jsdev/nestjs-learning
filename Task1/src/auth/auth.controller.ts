import { Body, Controller, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import type { Request, Response } from 'express';
import { CreateUserDTO } from 'src/user/dto/create-user-dto';
import { LoginUserDTO } from './dto/login-user-dto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

interface CustomRequest extends Request {
  user?: CreateUserDTO | null;
}

@Controller()
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  registerUser(@Res() response: Response, @Body() body: CreateUserDTO) {
    const existUser = this.userService.checkUserByUsername(body?.username);

    if (existUser) {
      return response.json({
        message: 'User Already Exist',
      });
    }

    const createUser = this.userService.createUser(body);

    response.status(HttpStatus.CREATED).send({
      user: createUser,
      message: 'User Created',
    });
  }

  @Post('login')
  async login(
    @Req() request: CustomRequest,
    @Res() response: Response,
    @Body() { username, password }: LoginUserDTO,
  ) {
    const existUser = this.userService.checkUserByUsername(username);

    const checkPassword = await bcrypt.compare(password, existUser?.password);

    if (!checkPassword) {
      response.status(HttpStatus.UNAUTHORIZED).send({
        message: 'Wrong Password',
      });
    }

    if (!existUser) {
      return response.status(HttpStatus.NOT_FOUND).send({
        message: 'User not found',
      });
    }

    const accessToken = jwt.sign(existUser, process.env.SECRET_KEY!);
    const refreshToken = jwt.sign(existUser, process.env.SECRET_KEY!);

    const accessTokenExpires = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000);
    const refreshTokenExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    request.user = existUser;
    response
      .status(HttpStatus.OK)
      .cookie('accessToken', accessToken, {
        expires: accessTokenExpires,
      })
      .cookie('refreshToken', refreshToken, {
        expires: refreshTokenExpires,
        httpOnly: true,
        secure: true,
      })
      .json({
        user: existUser,
        accessToken: accessToken,
      });
  }
}
