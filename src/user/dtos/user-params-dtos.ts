import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class UserParamDTO {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  id: number;
}