import { Inject } from '@nestjs/common';
import { Status, Todo } from '../todo.entity';
import TodoRepository from '../todo.repository';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import {
  ScanCommand,
  QueryCommand,
  PutItemCommand,
  DeleteItemCommand,
  QueryCommandInput,
} from '@aws-sdk/client-dynamodb';
import { mappingToEntity, mappingToRecordModel } from './object.mapper';
import { ensureDefined } from 'src/common';
import { SearchTodosRequest } from '../service/request/search-todos.request';
import DynamoDBException from 'src/modules/todos/exception/dynamodb.exception';
import EntityNotFoundException from 'src/modules/todos/exception/entity.not-found.exception';

export default class TodoRepositoryOnDynamoDB implements TodoRepository {
  constructor(
    @Inject('DynamoDBDocumentClinet')
    private ddbDocClient: DynamoDBDocumentClient,
    @Inject('DynamoDBTableName')
    private tableName: string,
  ) {}

  async findAll(): Promise<Todo[]> {
    const params = {
      TableName: this.tableName,
    };
    const data = this.ddbDocClient.send(new ScanCommand(params));
    return data
      .then((x) => ensureDefined(x.Items))
      .then((x) => x.map(mappingToRecordModel))
      .then((x) => x.map(mappingToEntity));
  }

  async findById(id: string): Promise<Todo> {
    const params = {
      ExpressionAttributeNames: { '#id': 'ID' },
      TableName: this.tableName,
      ExpressionAttributeValues: {
        ':id': { S: id },
      },
      KeyConditionExpression: '#id = :id',
    };

    const data = this.ddbDocClient.send(new QueryCommand(params));
    const entities = await data
      .then((x) => ensureDefined(x.Items))
      .then((x) => x.map(mappingToRecordModel))
      .then((x) => x.map(mappingToEntity));

    if (entities.length === 0) {
      throw new EntityNotFoundException(id);
    }

    return entities[0];
  }

  async findBy(condition: SearchTodosRequest): Promise<Todo[]> {
    const { title, description, status, dueDateFrom, dueDateTo } = condition;
    const statuses = status !== undefined ? [status] : Object.values(Status);

    const queryCommandInputList = statuses.map((x) => {
      const params = this.buildQueryCommandInput('Status', x, 'StatusIndex');
      const filterExpressions = [];
      if (description) {
        filterExpressions.push('contains(#description, :description)');
        params.ExpressionAttributeNames['#description'] = 'Description';
        params.ExpressionAttributeValues[':description'] = { S: description };
      }

      if (dueDateFrom) {
        filterExpressions.push('#dueDate >= :dueDateFrom');
        params.ExpressionAttributeNames['#dueDate'] = 'DueDate';
        params.ExpressionAttributeValues[':dueDateFrom'] = {
          S: this.formatDate(dueDateFrom),
        };
      }

      if (dueDateTo) {
        filterExpressions.push('#dueDate <= :dueDateTo');
        params.ExpressionAttributeNames['#dueDate'] = 'DueDate';
        params.ExpressionAttributeValues[':dueDateTo'] = {
          S: this.formatDate(dueDateTo),
        };
      }

      if (condition.title) {
        filterExpressions.push('contains(#title, :title)');
        params.ExpressionAttributeNames['#title'] = 'Title';
        params.ExpressionAttributeValues[':title'] = { S: title };
      }

      if (filterExpressions.length > 0) {
        params.FilterExpression = filterExpressions.join(' AND ');
      }

      return params;
    });

    const queryResults = queryCommandInputList.map((x) => {
      return this.ddbDocClient
        .send(new QueryCommand(x))
        .then((data) => ensureDefined(data.Items))
        .then((items) => items.map(mappingToRecordModel))
        .then((recordModels) => recordModels.map(mappingToEntity));
    });

    return Promise.all(queryResults)
      .then((results) => results.flat())
      .catch((error) => {
        console.error(error);
        const message = `Failed to search data: ${JSON.stringify(
          queryCommandInputList,
        )}`;
        return Promise.reject(new DynamoDBException(message, error));
      });
  }

  async store(todo: Todo): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        ID: { S: todo.id },
        Title: { S: todo.title },
        Status: { S: todo.status },
      },
    };

    if (todo.description !== undefined) {
      params.Item['Description'] = { S: todo.description };
    }
    if (todo.dueDate !== undefined) {
      params.Item['DueDate'] = { S: todo.formatDueDate };
    }

    await this.ddbDocClient.send(new PutItemCommand(params)).catch((e) => {
      console.error(e);
      return Promise.reject(
        new DynamoDBException(
          `Failed to store data: ${JSON.stringify(params)}`,
          e,
        ),
      );
    });
  }

  async deleteBy(todo: Todo): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: {
        ID: { S: todo.id },
      },
      ConditionExpression: 'attribute_exists(ID)',
    };

    await this.ddbDocClient.send(new DeleteItemCommand(params)).catch((e) => {
      console.error(e);
      throw new DynamoDBException(
        `Failed to delete data: ${JSON.stringify(params)}`,
        e,
      );
    });
  }

  buildQueryCommandInput = (
    key: string,
    value: string,
    gsiName?: string,
  ): QueryCommandInput => {
    const params = {
      TableName: this.tableName,
      IndexName: gsiName,
      ExpressionAttributeNames: { '#s': key },
      ExpressionAttributeValues: {
        ':s': { S: value },
      },
      KeyConditionExpression: '#s = :s',
    };

    gsiName ? (params.IndexName = gsiName) : {};
    return params;
  };

  private formatDate = (date: Date) => {
    return new Date(date).toISOString().slice(0, 10);
  };
}
