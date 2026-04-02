import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user-dto';
import { UserService } from './user.service';
import { UpdateUserDTO } from './dto/update-user-dto';
import { PaginationTodoDTO } from './dto/pagination-user';
import { UserResponseDTO } from './dto/user-response-dto';
import { AuthGuard } from '../common/guard/auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
@UseGuards(AuthGuard)
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() body: CreateUserDTO) {
    return await this.userService.createUser(body);
  }

  @Get()
  @Roles('Admin')
  @UseGuards(AuthGuard)
  async getUser() {
    return await this.userService.getUser();
  }

  @Get('paginated-data')
  async getPaginatedData(
    @Query() query: PaginationTodoDTO,
  ): Promise<UserResponseDTO[]> {
    const pageNumber = query.pageNumber ?? 1;
    const perPage = query.perPage ?? 10;

    const data = await this.userService.getPaginatedData(pageNumber, perPage);

    if (!data || data.length === 0) {
      throw new NotFoundException('Data not found');
    }

    return data;
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    const user = await this.userService.getUserById(id);

    if (!user) {
      throw new NotFoundException('User Not Found');
    }

    return user;
  }

  @Patch(':id')
  async updateUser(@Body() body: UpdateUserDTO, @Param('id') id: string) {
    const updated = await this.userService.updateUser(body, id);
    if (!updated) {
      throw new NotFoundException('User Not Found');
    }
    return updated;
  }

  @Delete(':id')
  @Roles('Admin')
  @UseGuards(AuthGuard)
  async deleteUser(@Param('id') id: string) {
    const deleted = await this.userService.deleteUser(id);
    if (!deleted) {
      throw new NotFoundException('User Not Found');
    }
    return deleted;
  }
}
