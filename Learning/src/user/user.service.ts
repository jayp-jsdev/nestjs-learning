import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateUser } from 'src/lib/validation/zodSchema';
import { UpdateUserDTO } from './dtos/update-user.dto';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class UserService {
  constructor(
    @Inject('CONFIG') private config,
    @Inject(forwardRef(() => ProductService))
    private readonly product: ProductService,
  ) {}

  users: CreateUser[] = [];
  isAuthenticated: boolean = false;

  addUser(body: CreateUser) {
    return this.users.push(body);
  }

  getConfigKey() {
    return this.config;
  }

  getUser(id: number) {
    const findUser = this.users.find((item) => item.id === id);

    return { user: findUser, product: this.product.getProduct() };
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

  loginUser() {
    this.isAuthenticated = true; // to Use this property in the ProductModule we have to export the Service so we can use isAuthenticated in the productModule and only show the product if user is authenticated
    return 'Auth Token Generated';
  }
}
