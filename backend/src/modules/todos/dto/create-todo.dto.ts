import { Todo, Status } from '../todo.entity';
import { v4 as uuidv4 } from 'uuid';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsEnum,
  IsDateString,
  IsNotEmpty,
  ValidateIf,
} from 'class-validator';
import { IsFuture } from '../../..//validator/date.validator';

export class CreateTodoDto {
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

export const genTodo = (dto: CreateTodoDto): Todo => {
  return new Todo({
    id: uuidv4(),
    title: dto.title,
    description: dto.description,
    dueDate: dto.dueDate,
    status: dto.status,
  });
};
