import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user-dto';
import { UserService } from './user.service';
import { UpdateUserDTO } from './dto/update-user-dto';
import { PaginationTodoDTO } from './dto/pagination-user';
import { UserResponseDTO } from './dto/user-response-dto';
import { AuthGuard } from '../common/guard/auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { type Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(AuthGuard)
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() body: CreateUserDTO) {
    return await this.userService.createUser(body);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getUser(@Req() req: Request) {
    return req.user;
  }

  @Get('paginated-data')
  async getPaginatedData(
    @Query() query: PaginationTodoDTO,
  ): Promise<UserResponseDTO[]> {
    const pageNumber = query.pageNumber ?? 1;
    const perPage = query.perPage ?? 10;

    return await this.userService.getPaginatedData(pageNumber, perPage);
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return await this.userService.getUserById(id);
  }

  @Patch(':id')
  async updateUser(@Body() body: UpdateUserDTO, @Param('id') id: string) {
    return await this.userService.updateUser(body, id);
  }

  @Delete(':id')
  @Roles('Admin')
  @UseGuards(AuthGuard)
  async deleteUser(@Param('id') id: string) {
    return await this.userService.deleteUser(id);
  }
}
