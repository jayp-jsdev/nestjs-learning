import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Product } from './entity/product.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductDTO } from './dto/product-dto';
import { UpdateProductDTO } from './dto/update-product-dto';
import { CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { RedisService } from '../config/redis-config';
import { DataSource } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    private readonly redisService: RedisService,
    private readonly dataSource: DataSource,
  ) {}

  async addProdcut(body: ProductDTO) {
    const redisClient = this.redisService.getClient();

    try {
      const user = await this.dataSource.transaction(async (manager) => {
        const product = await manager.save(Product, body);
        await redisClient.hset(`product`, product.id, JSON.stringify(product));
      });
      return user;
    } catch (err) {
      throw new HttpException(
        (err as Error).message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateProduct(body: UpdateProductDTO, id: string) {
    try {
      if (!id || id === undefined) {
        throw new HttpException('Product Id Not Found', HttpStatus.BAD_REQUEST);
      }

      const redisClient = this.redisService.getClient();

      const findProduct = await this.productRepository.findBy({
        id: id,
      });

      if (findProduct.length === 0) {
        throw new HttpException('Product Not Found', HttpStatus.BAD_REQUEST);
      }

      await this.productRepository.update(id, body);
      const findUpdatedProduct = await this.productRepository.find({
        where: {
          id,
        },
      });

      await redisClient.hset('product', id, JSON.stringify(findUpdatedProduct));
      return findUpdatedProduct;
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new HttpException(
        (err as Error).message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @CacheKey('products')
  @CacheTTL(60)
  async getProduct() {
    try {
      const redisClient = this.redisService.getClient();
      const cachedProducts: Record<string, string> =
        await redisClient.hgetall('products');

      if (Object.keys(cachedProducts).length > 0) {
        return Object.values(cachedProducts).map((p) =>
          JSON.parse(p),
        ) as ProductDTO[];
      }

      const products = await this.productRepository.find();

      if (products.length > 0) {
        const hashData = {};
        products.forEach((item) => (hashData[item.id] = JSON.stringify(item)));

        await redisClient.hset('products', hashData);
      }

      return products;
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new HttpException(
        (err as Error).message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async productPagination(pageNumber: number, perPage: number) {
    try {
      const previousPage = (pageNumber - 1) * perPage;
      const NextPage = pageNumber * perPage;

      const pageData = await this.productRepository.findAndCount({
        skip: previousPage,
        take: NextPage,
      });

      return pageData[0];
    } catch (err) {
      throw new HttpException(
        (err as Error).message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByIds(ids: string[]): Promise<Product[]> {
    try {
      if (!ids.length) return [];
      return this.productRepository
        .createQueryBuilder('product')
        .where('product.id IN (:...ids)', { ids })
        .getMany();
    } catch (err) {
      throw new HttpException(
        (err as Error).message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteProduct(id: string) {
    try {
      const redisClient = this.redisService.getClient();

      if (!id || id === undefined) {
        throw new HttpException('Product Id Not Found', HttpStatus.BAD_REQUEST);
      }

      const findProduct = await this.productRepository.findBy({
        id: id,
      });

      if (findProduct.length === 0) {
        throw new HttpException('Product Not Found', HttpStatus.BAD_REQUEST);
      }

      const deletedProduct = await this.productRepository.delete({ id });
      await redisClient.hdel('product', id);
      return deletedProduct;
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new HttpException(
        (err as Error).message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
