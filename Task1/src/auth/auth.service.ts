import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entity/user.entity';
import { UserService } from '../user/user.service';
import { CreateUserDTO } from '../user/dto/create-user-dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import JwtRefreshTokenConfig from './config/refresh-config';
import * as config from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @Inject(JwtRefreshTokenConfig.KEY)
    private readonly jwtRefreshTokenConfig: config.ConfigType<
      typeof JwtRefreshTokenConfig
    >,
  ) {}

  async checkUser(body: CreateUserDTO) {
    return await this.userService.createUser(body);
  }

  // async loginUser(username: string, password: string) {
  //   const existUser = await this.userRepo.findOneBy({
  //     username: username,
  //   });
  //   if (!existUser) {
  //     throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  //   }

  //   const checkPassword = await bcrypt.compare(password, existUser?.password);

  //   if (!checkPassword) {
  //     throw new HttpException('Wrong Password', HttpStatus.UNAUTHORIZED);
  //   }

  //   return plainToInstance(UserResponseDTO, existUser, {
  //     excludeExtraneousValues: true,
  //   });
  // }

  login(user) {
    const accessToken = this.jwtService.sign(user);
    const refreshToken = this.jwtService.sign(
      user,
      this?.jwtRefreshTokenConfig,
    );
    return { accessToken, refreshToken };
  }

  async validateJwtUser(username: string, password: string) {
    const user = await this.userRepo.findOneBy({ username });
    if (!user) throw new UnauthorizedException('User not found!');

    const isPasswordVadlid = await bcrypt.compare(password, user.password);
    if (!isPasswordVadlid) throw new UnauthorizedException('Invalid password!');

    return { id: user.id, role: user.role };
  }
}
