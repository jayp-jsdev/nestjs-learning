import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Res,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductType } from 'src/lib/Type';
import { Response } from 'express';

@Controller('product')
export class ProductController {
  constructor(private readonly product: ProductService) {}

  @Post('/add-product')
  addProduct(@Body() body: ProductType) {
    return this.product.addProduct(body);
  }

  @Get()
  getProduct(@Res({ passthrough: true }) res: Response) {
    const result = this.product.getProduct();
    if (result.length <= 0) {
      res.status(HttpStatus.BAD_REQUEST).send({
        message: 'Content Not Found',
      });
    }
    res.status(HttpStatus.OK).send({
      result,
    });
  }

  @Get(':id')
  getProductById(@Res() res: Response, @Param('id', ParseIntPipe) id: number) {
    const product = this.product.getProductById(id);
    if (!product) {
      res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Product Not found with this Id',
      });
    }
    res.status(HttpStatus.OK).json({
      message: 'Data Found',
      product,
    });
  }

  @Delete(':id')
  deleteProduct(@Res() res: Response, @Param('id', ParseIntPipe) id: number) {
    const findProduct = this.product.getProductById(id);

    if (!findProduct) {
      res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Product not found',
      });
    }

    this.product.removeProduct(id);
    res.status(HttpStatus.OK).json({
      message: 'Product Delete Successfully',
    });
  }
}
