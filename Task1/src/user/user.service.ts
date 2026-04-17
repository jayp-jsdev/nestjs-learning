import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
    try {
      const checkUser = await this.userRepository.findOneBy({
        username: user.username,
      });

      if (checkUser) {
        throw new HttpException('User Already Exist', HttpStatus.CONFLICT);
      }

      const hashPassword = await bcrypt.hash(user.password, 10);
      const userData = plainToInstance(User, {
        ...user,
        password: hashPassword,
      });

      await this.userRepository.save(userData);

      return plainToInstance(UserResponseDTO, userData, {
        excludeExtraneousValues: true,
      });
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new HttpException(
        (err as Error).message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUser() {
    try {
      const users = await this.userRepository.find({
        relations: {
          order: true,
        },
      });
      if (users.length === 0) {
        throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
      }

      return plainToInstance(UserResponseDTO, users, {
        excludeExtraneousValues: true,
      });
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new HttpException(
        (err as Error).message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUserById(id: string) {
    try {
      const findUser = await this.userRepository.findOne({
        where: { id },
        relations: ['order'],
      });
      if (!findUser)
        throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
      return findUser;
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new HttpException(
        (err as Error).message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateUser(data: UpdateUserDTO, id: string) {
    try {
      if (id === undefined) {
        throw new HttpException(
          'id is required for update',
          HttpStatus.BAD_REQUEST,
        );
      }

      const findUser = await this.userRepository.findOne({
        where: { id },
      });
      if (!findUser)
        throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);

      const updateData = await this.userRepository.update(id, {
        username: data?.username,
        name: data?.name,
        email: data?.email,
      });

      return plainToInstance(UserResponseDTO, updateData, {
        excludeExtraneousValues: true,
      });
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new HttpException(
        (err as Error).message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteUser(id: string) {
    try {
      const findUser = await this.userRepository.findOne({
        where: { id },
      });
      if (!findUser)
        throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);

      return await this.userRepository.delete(id);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new HttpException(
        (err as Error).message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getPaginatedData(pageNumber: number, perPage: number) {
    try {
      const previousPage = (pageNumber - 1) * perPage;
      const NextPage = pageNumber * perPage;

      const pageData = await this.userRepository.findAndCount({
        skip: previousPage,
        take: NextPage,
      });

      return plainToInstance(UserResponseDTO, pageData, {
        excludeExtraneousValues: true,
      });
    } catch (err) {
      throw new HttpException(
        (err as Error).message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
