import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Product } from './entity/product.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {}

  async addProdcut(body) {
    try {
      return await this.productRepository.save(body);
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Product creation failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateProduct(body) {
    try {
      const findProduct = await this.productRepository.findBy({
        id: body.id,
      });

      if (findProduct.length === 0) {
        throw new HttpException('Product Not Found', HttpStatus.BAD_REQUEST);
      }

      return await this.productRepository.update(body.id, body);
    } catch (error: any) {
      console.log(error, 'Failed to update user');
      throw new HttpException(
        error.message || 'Failed to update user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getProduct() {
    return await this.productRepository.find({
      relations: ['order'],
    });
  }

  async productPagination(pageNumber: number, perPage: number) {
    const previousPage = (pageNumber - 1) * perPage;
    const NextPage = pageNumber * perPage;

    const pageData = await this.productRepository.findAndCount({
      skip: previousPage,
      take: NextPage,
    });

    return pageData[0];
  }
}
