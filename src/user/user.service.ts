import { Injectable } from '@nestjs/common';
import { UsersType } from 'src/lib/Type';
import { CreateUser } from 'src/lib/validation/zodSchema';

@Injectable()
export class UserService {
  users: CreateUser[] = [];

  addUser(body: CreateUser) {
    return this.users.push(body);
  }

  getUser(id: number) {
    const findUser = this.users.find((item) => item.id === id);
    return findUser;
  }
}
