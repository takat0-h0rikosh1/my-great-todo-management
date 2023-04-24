import { Module } from '@nestjs/common';
import TodoController from './todo.controller';
import TodoService from './todo.service';
import TodoRepositoryOnDynamoDB from './infrastructure/todo.repository.on-dynamodb';
import { ddbDocClient } from './infrastructure/dynamodb';
import { tableName } from './todo.config';

@Module({
  imports: [],
  controllers: [TodoController],
  providers: [
    TodoService,
    {
      provide: 'TodoRepository',
      useClass: TodoRepositoryOnDynamoDB,
    },
    {
      provide: 'DynamoDBDocumentClinet',
      useValue: ddbDocClient,
    },
    {
      provide: 'DynamoDBTableName',
      useValue: tableName,
    },
  ],
})
export default class TodoModule {}
