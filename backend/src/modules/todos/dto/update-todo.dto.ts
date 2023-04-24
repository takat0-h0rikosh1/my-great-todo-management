import { Status } from '../todo.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsDefined, IsEnum, IsOptional } from 'class-validator';

export class UpdateTodoDto {
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
