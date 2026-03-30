import { Body, Controller, Get, Param, Patch, Post, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from './dtos/create-user-dtos';
import { UserParamDTO } from './dtos/user-params-dtos';
import { UpdateUserDTO } from './dtos/update-user.dto';
import { validate } from 'class-validator';

@Controller('/user')
export class UserController {
  constructor(private readonly userservice: UserService) {}

  @Post('/add-user')
  // @UsePipes(new ZodValidationPipe(createUserSchema))
  addUser(@Body() body: CreateUserDTO) {
    return this.userservice.addUser(body);
  }
  @Get('/get-user/:id')
  getUser(@Param() param: UserParamDTO) {
    console.log("Get User Called")
    return this.userservice.getUser(param.id);
  }

  @Patch()
  updateUser(@Body() user: UpdateUserDTO) {
    return this.userservice.updateUser(user);
  }

  @Get('/config-key')
  configKey() {
    return this.userservice.getConfigKey();
  }

  @Post('/login')
  loginUser() {
    return this.userservice.loginUser();
  }
}
