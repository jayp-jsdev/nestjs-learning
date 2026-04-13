import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Product } from './entity/product.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductDTO } from './dto/product-dto';
import { UpdateProductDTO } from './dto/update-product-dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {}

  async addProdcut(body: ProductDTO) {
    try {
      return await this.productRepository.save(body);
    } catch (error) {
      throw new HttpException(
        (error as Error)?.message || 'Failed to create product',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateProduct(body: UpdateProductDTO) {
    try {
      const findProduct = await this.productRepository.findBy({
        id: body.id,
      });

      if (findProduct.length === 0) {
        throw new HttpException('Product Not Found', HttpStatus.BAD_REQUEST);
      }

      return await this.productRepository.update(body.id || '', body);
    } catch (error: any) {
      throw new HttpException(
        (error as Error)?.message || 'Failed to update user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getProduct() {
    return await this.productRepository.find({
      relations: ['orders'],
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

  async findByIds(ids: string[]): Promise<Product[]> {
    if (!ids.length) return [];
    return this.productRepository
      .createQueryBuilder('product')
      .where('product.id IN (:...ids)', { ids })
      .getMany();
  }
}
