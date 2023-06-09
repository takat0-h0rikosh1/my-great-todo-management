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
  GetItemCommand,
} from '@aws-sdk/client-dynamodb';
import { mappingToEntity, mappingToRecordModel } from './object.mapper';
import { ensureDefinedWith } from '../../../utils/ensure-undefined';
import { SearchTodosRequest } from '../service/request/search-todos.request';
import DynamoDBException from '../../../modules/todos/exception/dynamodb.exception';
import { ddbDocClient } from './dynamodb';

export default class TodoRepositoryOnDynamoDB implements TodoRepository {
  constructor(
    @Inject('DynamoDBDocumentClinet')
    private ddbDocClient: DynamoDBDocumentClient,
    @Inject('DynamoDBTableName')
    private tableName: string,
  ) {}

  // @deprecated: フルスキャンするので要注意!!!
  async findAll(): Promise<Todo[]> {
    const params = {
      TableName: this.tableName,
    };
    const command = new ScanCommand(params);

    try {
      const result = await this.ddbDocClient.send(command);

      if (result.Items) {
        const records = result.Items.map(mappingToRecordModel);
        return records.map(mappingToEntity);
      }

      return [] as Todo[];
    } catch (error) {
      throw new DynamoDBException(
        `Failed to retrieve data: ${JSON.stringify(params)}`,
        error,
      );
    }
  }

  async findById(id: string): Promise<Todo | undefined> {
    const params = {
      TableName: this.tableName,
      Key: { ID: { S: id } },
    };
    const command = new GetItemCommand(params);

    try {
      const result = await ddbDocClient.send(command);
      if (result.Item) {
        const record = mappingToRecordModel(result.Item);
        return mappingToEntity(record);
      }
    } catch (error) {
      console.error(error);
      throw new DynamoDBException(
        `Failed to retrieve data: ${JSON.stringify(params)}`,
        error,
      );
    }
  }

  // TODO: pagenation
  async findBy(condition: SearchTodosRequest): Promise<Todo[]> {
    const { title, description, status, dueDateFrom, dueDateTo } = condition;
    const statuses = status !== undefined ? [status] : Object.values(Status);

    const queryCommands = statuses.map((x) => {
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

    try {
      const results = queryCommands.map(async (command) => {
        const data = await this.ddbDocClient.send(new QueryCommand(command));
        const items = ensureDefinedWith(data.Items, () => {
          throw new DynamoDBException(
            `Failed to search data: ${JSON.stringify(command)}`,
          );
        });
        const recordModels = items.map(mappingToRecordModel);
        return recordModels.map(mappingToEntity);
      });
      const nested = await Promise.all(results);
      const todos = nested.flat();
      return todos;
    } catch (error) {
      throw new DynamoDBException(
        `Failed to search data: ${JSON.stringify(queryCommands)}`,
        error,
      );
    }
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

    const command = new PutItemCommand(params);
    await this.ddbDocClient.send(command).catch((error) => {
      throw new DynamoDBException(
        `Failed to store data: ${JSON.stringify(params)}`,
        error,
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
    const command = new DeleteItemCommand(params);

    await this.ddbDocClient.send(command).catch((e) => {
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
