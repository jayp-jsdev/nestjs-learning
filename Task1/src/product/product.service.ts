/* eslint-disable @typescript-eslint/no-misused-promises */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Product } from './entity/product.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductDTO } from './dto/product-dto';
import { UpdateProductDTO } from './dto/update-product-dto';
import { CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { RedisService } from '../config/redis-config';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    private readonly redisService: RedisService,
  ) {}

  async addProdcut(body: ProductDTO) {
    return await this.productRepository.save(body);
  }

  async updateProduct(body: UpdateProductDTO) {
    const redisClient = this.redisService.getClient();

    const findProduct = await this.productRepository.findBy({
      id: body.id,
    });

    if (findProduct.length === 0) {
      throw new HttpException('Product Not Found', HttpStatus.BAD_REQUEST);
    }
    await redisClient.del('products');
    return await this.productRepository.update(body.id || '', body);
  }

  @CacheKey('products')
  @CacheTTL(60)
  async getProduct() {
    const redisClient = this.redisService.getClient();
    const cachedProducts = await redisClient.get('products');
    if (cachedProducts) {
      console.log('Products retrieved from cache');
      return JSON.parse(cachedProducts) as JSON;
    }

    const products = await new Promise((resolve) =>
      setTimeout(async (): Promise<any> => {
        const products = await this.productRepository.find();
        resolve(products);
      }, 2000),
    );
    await redisClient.set('products', JSON.stringify(products), 'EX', 60);
    console.log('Products retrieved from database');
    return products;
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
