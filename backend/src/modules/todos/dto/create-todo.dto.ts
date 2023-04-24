import { Todo, Status } from '../todo.entity';
import { v4 as uuidv4 } from 'uuid';
import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsOptional, IsEnum, IsDateString } from 'class-validator';

export class CreateTodoDto {
  @ApiProperty()
  @IsDefined()
  title: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
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
