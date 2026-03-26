import { Body, Controller, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { catsType } from './lib/Type';
import { response } from 'express';

@Controller('/cat')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get(':id')
  getCatsById(@Param('id') params: string): any {
    const id = params;
    const data = this.appService.findCat(id);
    if (data.length <= 0) {
      return response.status(HttpStatus.NO_CONTENT).json({
        message: 'Content Not Found',
      });
    }
    return data;
  }

  @Post('/add-cat')
  addCat(@Body() body: catsType): catsType {
    return this.appService.addCat(body);
  }
}
