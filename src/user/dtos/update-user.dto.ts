import { PartialType } from '@nestjs/mapped-types';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { CreateUserDTO } from './create-user-dtos';

export class UpdateUserDTO extends PartialType(CreateUserDTO) {}
