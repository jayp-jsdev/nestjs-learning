import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import { User } from '../user/entity/user.entity';
import { UserService } from '../user/user.service';
import { CreateUserDTO } from '../user/dto/create-user-dto';
import { plainToInstance } from 'class-transformer';
import { UserResponseDTO } from '../user/dto/user-response-dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private readonly userService: UserService,
  ) {}

  async checkUser(body: CreateUserDTO) {
    return await this.userService.createUser(body);
  }

  async loginUser(username: string, password: string) {
    const existUser = await this.userRepo.findOneBy({
      username: username,
    });
    if (!existUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const checkPassword = await bcrypt.compare(password, existUser?.password);

    if (!checkPassword) {
      throw new HttpException('Wrong Password', HttpStatus.UNAUTHORIZED);
    }

    return plainToInstance(UserResponseDTO, existUser, {
      excludeExtraneousValues: true,
    });
  }
}
