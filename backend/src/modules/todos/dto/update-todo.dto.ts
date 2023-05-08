import { Status } from '../todo.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  ValidateIf,
} from 'class-validator';
import { IsFuture } from '../../../validator/date.validator';

export class UpdateTodoDto {
  @ApiProperty()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  @ValidateIf((object, value) => value !== undefined)
  @IsFuture({ message: 'Due date must be in the future' })
  dueDate?: Date;

  @ApiProperty({
    enum: Object.values(Status),
  })
  @IsEnum(Status)
  status: Status;
}
