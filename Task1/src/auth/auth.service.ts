import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDTO } from 'src/user/dto/create-user-dto';
import { User } from 'src/user/entity/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private readonly userService: UserService,
  ) {}

  async checkUser(body: CreateUserDTO) {
    const existUser = await this.userService.createUser(body);
    if (existUser) {
      throw new HttpException('User Already Exist', HttpStatus.OK);
    }

    return existUser;
  }

  async loginUser(username: string, password: string) {
    const existUser = await this.userRepo.findOneBy({
      username: username,
    });
    const checkPassword = await bcrypt.compare(password, existUser?.password);

    if (!checkPassword) {
      throw new HttpException('Wrong Password', HttpStatus.UNAUTHORIZED);
    }

    if (!existUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return existUser;
  }
}
