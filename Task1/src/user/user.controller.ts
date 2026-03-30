import { Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user-dto';
import { UserService } from './user.service';
import { UpdateUserDTO } from './dto/update-user-dto';
import { PaginationTodoDTO } from './dto/pagination-user';
import { UserResponseDTO } from './dto/user-response-dto';

@Controller()
export class UserController {
    constructor (private readonly userService: UserService) {}

    @Post()
    createUser(@Body() body: CreateUserDTO){
        return this.userService.createUser(body);
    }

    @Get()
    getUser(){
        const users = this.userService.getUser()
        if(users.length === 0) {
            throw new NotFoundException("User Not Found")
        }

        return users
    }
    
    @Get("paginated-data")
    getPaginatedData(@Query() query: PaginationTodoDTO): UserResponseDTO[] {
        const pageNumber = query.pageNumber ?? 1;
        const perPage = query.perPage ?? 10;

        const data = this.userService.getPaginatedData(pageNumber, perPage)

        if(!data || data.length === 0){
            throw new NotFoundException("Data not found")
        }

        return data
    }

    @Get(":id")
    getUserById(@Param("id", ParseIntPipe) id: number){
        const user =  this.userService.getUserById(id)

        if(!user) {
            throw new NotFoundException("User Not Found")
        }

        return user
    }

    @Patch()
    updateUser(@Body() body: UpdateUserDTO){
        const updated = this.userService.updateUser(body);
        if(!updated){
            throw new NotFoundException("User Not Found")
        }
        return updated;
    }

    @Delete(":id")
    deleteUser(@Param("id", ParseIntPipe) id: number) {
        const deleted = this.userService.deleteUser(id);
        if(!deleted){
            throw new NotFoundException("User Not Found")
        }
        return deleted;
    }
}
