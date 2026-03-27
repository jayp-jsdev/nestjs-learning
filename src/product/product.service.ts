import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { ProductType } from 'src/lib/Type';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ProductService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userservice: UserService,
  ) {}

  product: ProductType[] = [];

  addProduct(productData: ProductType) {
    return this.product.push(productData);
  }

  removeProduct(id: number) {
    const filterProduct = this.product.filter((item) => item.id !== id);
    return filterProduct;
  }

  getProductAndUser() {
    return { product: this.product, user: this.userservice.users };
  }

  getProduct() {
    return this.userservice.isAuthenticated ? this.product : [];
  }

  getProductById(id: number) {
    const findProduct = this.product.find((item) => item.id === id);
    return findProduct;
  }
}
