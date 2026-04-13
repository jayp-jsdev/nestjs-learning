import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDTO } from '../user/dto/create-user-dto';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller()
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('register')
  async registerUser(@Res() response: Response, @Body() body: CreateUserDTO) {
    try {
      const existUser = await this.authService.checkUser(body);

      response.status(HttpStatus.CREATED).send({
        user: existUser,
        message: 'User Created',
      });
    } catch (error) {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Internal server error',
        error: error as Error,
      });
    }
  }

  // @Post('login')
  // async login(
  //   @Req() request: CustomRequest,
  //   @Res() response: Response,
  //   @Body() { username, password }: LoginUserDTO,
  // ) {
  //   try {
  //     const existUser = await this.authService.loginUser(username, password);

  //     // const accessToken = jwt.sign({ ...existUser }, process.env.SECRET_KEY!);
  //     const accessToken = this.jwtService.sign({ ...existUser });
  //     const refreshToken = jwt.sign({ ...existUser }, process.env.SECRET_KEY!);

  //     const accessTokenExpires = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000);
  //     const refreshTokenExpires = new Date(
  //       Date.now() + 7 * 24 * 60 * 60 * 1000,
  //     );
  //     request.user = existUser;
  //     response
  //       .status(HttpStatus.OK)
  //       .cookie('accessToken', accessToken, {
  //         expires: accessTokenExpires,
  //       })
  //       .cookie('refreshToken', refreshToken, {
  //         expires: refreshTokenExpires,
  //         httpOnly: true,
  //         secure: true,
  //       })
  //       .json({
  //         user: existUser,
  //         accessToken: accessToken,
  //       });
  //   } catch (error) {
  //     response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
  //       message: 'Internal Server error',
  //       error,
  //     });
  //   }
  // }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @UseGuards(JwtAuthGuard)
  login(@Req() req: Request) {
    console.log('Login successful, user:', req.user);
    // return req.user;
  }
}
