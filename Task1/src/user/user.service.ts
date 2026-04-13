import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user-dto';
import { UpdateUserDTO } from './dto/update-user-dto';
import { plainToInstance } from 'class-transformer';
import { UserResponseDTO } from './dto/user-response-dto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async createUser(user: CreateUserDTO) {
    const checkUser = await this.userRepository.findOneBy({
      username: user.username,
    });

    if (checkUser) {
      throw new HttpException('User Already Exist', HttpStatus.OK);
    }

    const hashPassword = await bcrypt.hash(user.password, 10);
    const userData = plainToInstance(User, { ...user, password: hashPassword });

    await this.userRepository.save(userData);

    return plainToInstance(UserResponseDTO, userData, {
      excludeExtraneousValues: true,
    });
  }

  async getUser() {
    const users = await this.userRepository.find({
      relations: {
        order: true,
      },
    });
    if (users.length === 0) {
      throw new NotFoundException('User Not Found');
    }

    return plainToInstance(UserResponseDTO, users, {
      excludeExtraneousValues: true,
    });
  }

  // checkUserByUsername(username: string) {
  //   const findUser = this.users.find(
  //     (user) => user.username.toLowerCase() === username.toLowerCase(),
  //   );

  //   if (findUser) {
  //     return findUser;
  //   }

  //   return null;
  // }

  async getUserById(id: string) {
    const findUser = await this.userRepository.findOne({
      where: { id },
    });
    if (!findUser) return null;

    return findUser;
  }

  async updateUser(data: UpdateUserDTO, id: string) {
    if (id === undefined) {
      throw new BadRequestException('id is required for update');
    }

    const updateData = await this.userRepository.update(id, {
      username: data?.username,
      name: data?.name,
      email: data?.email,
    });

    return plainToInstance(UserResponseDTO, updateData, {
      excludeExtraneousValues: true,
    });
  }

  async deleteUser(id: string) {
    return await this.userRepository.delete(id);
  }

  async getPaginatedData(pageNumber: number, perPage: number) {
    const previousPage = (pageNumber - 1) * perPage;
    const NextPage = pageNumber * perPage;

    const pageData = await this.userRepository.findAndCount({
      skip: previousPage,
      take: NextPage,
    });

    return plainToInstance(UserResponseDTO, pageData, {
      excludeExtraneousValues: true,
    });
  }
}
