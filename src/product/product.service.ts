import { Injectable } from '@nestjs/common';
import { ProductType } from 'src/lib/Type';

@Injectable()
export class ProductService {
  product: ProductType[] = [];

  addProduct(productData: ProductType) {
    return this.product.push(productData);
  }

  removeProduct(id: number) {
    const filterProduct = this.product.filter((item) => item.id !== id);
    return filterProduct;
  }

  getProduct() {
    return this.product;
  }

  getProductById(id: number) {
    const findProduct = this.product.find((item) => item.id === id);
    return findProduct;
  }
}
