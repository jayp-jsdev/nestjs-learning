import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UsePipes,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ZodValidationPipe } from 'src/pipes/validationPipes';
import { CreateUser, createUserSchema } from 'src/lib/validation/zodSchema';

@Controller('/user')
export class UserController {
  constructor(private readonly userservice: UserService) {}

  @Post('/add-user')
  // @UsePipes(new ZodValidationPipe(createUserSchema))
  addUser(
    @Body(new ZodValidationPipe(createUserSchema as any)) body: CreateUser,
  ) {
    return this.userservice.addUser(body);
  }
  @Get('/get-user/:id')
  getUser(@Param('id', ParseIntPipe) id: number) {
    return this.userservice.getUser(id);
  }
}
