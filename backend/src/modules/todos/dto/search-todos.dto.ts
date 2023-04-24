import { Status } from '../todo.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional } from 'class-validator';

export class SearchTodosDto {
  @ApiProperty({ required: false })
  title?: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  dueDateFrom?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  dueDateTo?: Date;

  @ApiProperty({ required: false })
  @ApiProperty({
    enum: Object.values(Status),
  })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;
}
