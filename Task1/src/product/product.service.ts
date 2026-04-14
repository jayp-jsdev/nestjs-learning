import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UseInterceptors,
} from '@nestjs/common';
import { Product } from './entity/product.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductDTO } from './dto/product-dto';
import { UpdateProductDTO } from './dto/update-product-dto';
import {
  CACHE_MANAGER,
  CacheInterceptor,
  CacheKey,
  CacheTTL,
} from '@nestjs/cache-manager';
import * as cacheManager_1 from 'cache-manager';
import { RedisStore } from 'cache-manager-redis-store';

@Injectable()
@UseInterceptors(CacheInterceptor)
export class ProductService {
  private readonly redisStore!: RedisStore;

  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @Inject(CACHE_MANAGER) private cacheManager: cacheManager_1.Cache,
  ) {
    this.redisStore = this.cacheManager.stores as unknown as RedisStore;
  }

  async addProdcut(body: ProductDTO) {
    return await this.productRepository.save(body);
  }

  async updateProduct(body: UpdateProductDTO) {
    const findProduct = await this.productRepository.findBy({
      id: body.id,
    });

    if (findProduct.length === 0) {
      throw new HttpException('Product Not Found', HttpStatus.BAD_REQUEST);
    }

    return await this.productRepository.update(body.id || '', body);
  }

  @CacheKey('all_products')
  @CacheTTL(20)
  async getProduct() {
    const products = await this.productRepository.find();
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
