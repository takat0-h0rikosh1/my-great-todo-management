import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  HttpStatus,
  HttpCode,
  Put,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import TodoService from './todo.service';
import { Todo } from './todo.entity';
import { CreateTodoDto, genTodo } from './dto/create-todo.dto';
import {
  ApiTags,
  ApiBody,
  ApiResponse,
  ApiQuery,
  ApiOperation,
} from '@nestjs/swagger';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { UpdateTodoRequest } from './service/request/update-todo.request';
import { SearchTodosDto } from './dto/search-todos.dto';
import { SearchTodosRequest } from './service/request/search-todos.request';

@Controller('todos')
@ApiTags('/todos')
export default class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  @ApiOperation({
    summary: 'Search todos',
    description:
      'This endpoint searches for todos based on specified criteria. If no criteria are specified, all todos will be returned. If criteria are specified, only resources that satisfy all criteria will be returned.',
  })
  @ApiQuery({
    name: 'title',
    required: false,
    description: '【Supports fuzzy search】The title of the todo to search for',
  })
  @ApiQuery({
    name: 'description',
    required: false,
    description:
      '【Supports fuzzy search】The description of the todo to search for',
  })
  @ApiQuery({
    name: 'dueDateFrom',
    required: false,
    description: 'The start date of the due date range to search for',
  })
  @ApiQuery({
    name: 'dueDateTo',
    required: false,
    description: 'The end date of the due date range to search for',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'The status of the todo to search for',
  })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 500, description: 'Internal server error occurred' })
  async search(@Query() query: SearchTodosDto): Promise<Todo[]> {
    return this.todoService.search(query as SearchTodosRequest);
  }

  @Post()
  @ApiOperation({ summary: 'Create todo' })
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({ type: CreateTodoDto })
  @ApiResponse({ status: 204, description: 'Successfully created' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Internal server error occurred' })
  async create(@Body() dto: CreateTodoDto, @Res() response): Promise<void> {
    const result = await this.todoService.create(genTodo(dto));
    response.status(HttpStatus.CREATED).send(result);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update todo' })
  @ApiBody({ type: UpdateTodoDto })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: 204, description: 'Successfully updated' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'Resource not found' })
  @ApiResponse({ status: 500, description: 'Internal server error occurred' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateTodoDto,
    @Res() response,
  ): Promise<void> {
    const result = await this.todoService.update({
      id: id,
      title: dto.title,
      description: dto.description,
      dueDate: dto.dueDate,
      status: dto.status,
    } as UpdateTodoRequest);
    response.status(HttpStatus.NO_CONTENT).send(result);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete todo' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: 204, description: 'Successfully deleted' })
  @ApiResponse({ status: 404, description: 'Resource not found' })
  @ApiResponse({ status: 500, description: 'Internal server error occurred' })
  async delete(@Param('id') id: string, @Res() response): Promise<void> {
    return this.todoService.deleteBy(id).then((result) => {
      response.status(HttpStatus.NO_CONTENT).send(result);
    });
  }
}
