import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user-dto';
import { UpdateUserDTO } from './dto/update-user-dto';
import { plainToInstance } from 'class-transformer';
import { UserResponseDTO } from './dto/user-response-dto';
import bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private users: CreateUserDTO[] = [];

  async createUser(user: CreateUserDTO) {
    const hashPassword = await bcrypt.hash(user.password, 10);
    this.users.push({ ...user, password: hashPassword });
    return plainToInstance(UserResponseDTO, user, {
      excludeExtraneousValues: true,
    });
  }

  getUser() {
    return plainToInstance(UserResponseDTO, this.users, {
      excludeExtraneousValues: true,
    });
  }

  checkUserByUsername(username: string) {
    const findUser = this.users.find(
      (user) => user.username.toLowerCase() === username.toLowerCase(),
    );

    if (findUser) {
      return findUser;
    }

    return null;
  }

  getUserById(id: number) {
    const findUser = this.users.find((user) => user.id === id);
    if (!findUser) return null;

    return plainToInstance(UserResponseDTO, findUser, {
      excludeExtraneousValues: true,
    });
  }

  updateUser(data: UpdateUserDTO, id: number) {
    if (id === undefined) {
      throw new BadRequestException('`id` is required for update');
    }

    const findUserIndex = this.users.findIndex((user) => user.id === id);
    if (findUserIndex === -1) return null;

    const updatedUser: CreateUserDTO = {
      ...this.users[findUserIndex],
      ...data,
      id: this.users[findUserIndex].id,
    };

    this.users[findUserIndex] = updatedUser;
    return plainToInstance(UserResponseDTO, updatedUser, {
      excludeExtraneousValues: true,
    });
  }

  deleteUser(id: number) {
    const findUserIndex = this.users.findIndex((user) => user.id === id);
    if (findUserIndex === -1) return null;

    const [deletedUser] = this.users.splice(findUserIndex, 1);
    if (!deletedUser) return null;

    return plainToInstance(UserResponseDTO, deletedUser, {
      excludeExtraneousValues: true,
    });
  }

  getPaginatedData(pageNumber: number, perPage: number) {
    const previousPage = (pageNumber - 1) * perPage;
    const NextPage = pageNumber * perPage;

    const pageData = this.users.slice(previousPage, NextPage);

    return plainToInstance(UserResponseDTO, pageData, {
      excludeExtraneousValues: true,
    });
  }
}
