import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ProductDTO } from './dto/product-dto';
import { ProductService } from './product.service';
import { UpdateProductDTO } from './dto/update-product-dto';
import { PaginationTodoDTO } from '../user/dto/pagination-user';

@Controller()
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post()
  async addProduct(@Body() body: ProductDTO) {
    return await this.productService.addProdcut(body);
  }

  @Get()
  async getProduct() {
    return await this.productService.getProduct();
  }

  @Get('paginated-product')
  async productPagination(@Query() query: PaginationTodoDTO) {
    return this.productService.productPagination(
      query.pageNumber ?? 1,
      query.perPage ?? 10,
    );
  }

  @Patch()
  async updateProduct(@Body() body: UpdateProductDTO) {
    return await this.productService.updateProduct(body);
  }
}
