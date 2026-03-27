import { Injectable } from '@nestjs/common';
import { CreateUser } from 'src/lib/validation/zodSchema';
import { UpdateUserDTO } from './dtos/update-user.dto';

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

  updateUser(user: UpdateUserDTO) {
    const findUser = this.users.findIndex((item) => item.id === user?.id);

    let updateUser = this.users[findUser];
    if (findUser !== -1) {
      updateUser = { ...updateUser, ...user };
    }
    this.users[findUser] = updateUser;
    return this.users;
  }
}
