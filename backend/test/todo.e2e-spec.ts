import { Test, TestingModule } from '@nestjs/testing';
import {
  HttpServer,
  HttpStatus,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import request from 'supertest';
import TodoModule from '../src/modules/todos/todo.module';
import { ddbDocClient } from '../src/modules/todos/infrastructure/dynamodb';
import {
  DeleteItemCommand,
  GetItemCommand,
  PutItemCommand,
} from '@aws-sdk/client-dynamodb';
import { Status, Todo } from '../src/modules/todos/todo.entity';
import { getTodayISOString } from '../src/utils/date.utility';
import { tableName } from '../src/modules/todos/todo.config';
import { ScanCommand } from '@aws-sdk/lib-dynamodb';
import {
  mappingToRecordModel,
  mappingToEntity,
} from '../src/modules/todos/infrastructure/object.mapper';

describe('TodoController (e2e)', () => {
  const testTableName = `${tableName}_Test`;
  let app: INestApplication;
  let server: HttpServer;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TodoModule],
    })
      .overrideProvider('DynamoDBTableName')
      .useValue(testTableName)
      .compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    server = app.getHttpServer();
  });

  afterEach(async () => {
    const params = {
      TableName: testTableName,
    };
    const data = await ddbDocClient.send(new ScanCommand(params));
    for (const item of data.Items) {
      await deleteTodoFromDb(item.ID);
    }
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/todos (GET)', () => {
    it('should return all todos when search conditons are not specified', async () => {
      const todo1 = new Todo({
        id: '1',
        title: 'test title 1',
        description: 'test description 1',
        status: Status.IN_PROGRESS,
        dueDate: new Date('2023-01-01'),
      });
      const todo2 = new Todo({
        id: '2',
        title: 'test title 2',
        description: 'test description 2',
        status: Status.COMPLETED,
        dueDate: new Date('2023-02-01'),
      });
      const todo3 = new Todo({
        id: '3',
        title: 'test title 3',
        description: 'test description 3',
        status: Status.TODO,
        dueDate: new Date('2023-03-01'),
      });
      await createTodoInDb(todo1);
      await createTodoInDb(todo2);
      await createTodoInDb(todo3);
      const response = await request(server).get('/todos');
      expect(response.body.length).toBeGreaterThan(0);
      const responseSortedById = response.body.sort((a, b) => a.id - b.id);
      expect(responseSortedById[0]).toHaveProperty('id', todo1.id);
      expect(responseSortedById[0]).toHaveProperty('title', todo1.title);
      expect(responseSortedById[0]).toHaveProperty(
        'description',
        todo1.description,
      );
      expect(responseSortedById[0]).toHaveProperty('status', todo1.status);
      expect(responseSortedById[0]).toHaveProperty(
        'dueDate',
        todo1.dueDate.toISOString(),
      );
      expect(responseSortedById[1]).toHaveProperty('id', todo2.id);
      expect(responseSortedById[1]).toHaveProperty('title', todo2.title);
      expect(responseSortedById[1]).toHaveProperty(
        'description',
        todo2.description,
      );
      expect(responseSortedById[1]).toHaveProperty('status', todo2.status);
      expect(responseSortedById[1]).toHaveProperty(
        'dueDate',
        todo2.dueDate.toISOString(),
      );
      expect(responseSortedById[2]).toHaveProperty('id', todo3.id);
      expect(responseSortedById[2]).toHaveProperty('title', todo3.title);
      expect(responseSortedById[2]).toHaveProperty(
        'description',
        todo3.description,
      );
      expect(responseSortedById[2]).toHaveProperty('status', todo3.status);
      expect(responseSortedById[2]).toHaveProperty(
        'dueDate',
        todo3.dueDate.toISOString(),
      );
    });

    it('should return todos that match the search conditions', async () => {
      const todo1 = new Todo({
        id: '1',
        title: 'Finish homework',
        description: 'Complete math and science assignments',
        status: Status.IN_PROGRESS,
        dueDate: new Date('2023-06-01'),
      });
      const todo2 = new Todo({
        id: '2',
        title: 'Buy groceries',
        description: 'Apples, bananas, milk',
        status: Status.TODO,
        dueDate: new Date('2023-06-10'),
      });
      const todo3 = new Todo({
        id: '3',
        title: 'Do laundry',
        description: 'Wash and fold clothes',
        status: Status.COMPLETED,
        dueDate: new Date('2023-06-15'),
      });
      await createTodoInDb(todo1);
      await createTodoInDb(todo2);
      await createTodoInDb(todo3);

      // Test search by title
      const response1 = await request(server)
        .get('/todos')
        .query({ title: 'Finish' })
        .expect(200);

      expect(response1.body).toHaveLength(1);
      expect(response1.body[0]).toEqual(
        expect.objectContaining({ id: todo1.id }),
      );

      // Test search by description
      const response2 = await request(server)
        .get('/todos')
        .query({ description: 'bananas' })
        .expect(200);

      expect(response2.body).toHaveLength(1);
      expect(response2.body[0]).toEqual(
        expect.objectContaining({ id: todo2.id }),
      );

      // Test search by due date range
      const response3 = await request(server)
        .get('/todos')
        .query({
          dueDateFrom: new Date('2023-06-01').toISOString(),
          dueDateTo: new Date('2023-06-10').toISOString(),
        })
        .expect(200);

      expect(response3.body).toHaveLength(2);
      expect(response3.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: todo1.id }),
          expect.objectContaining({ id: todo2.id }),
        ]),
      );

      // Test search by status
      const response4 = await request(server)
        .get('/todos')
        .query({ status: Status.COMPLETED })
        .expect(200);

      expect(response4.body).toHaveLength(1);
      expect(response4.body[0]).toEqual(
        expect.objectContaining({ id: todo3.id }),
      );
    });
  });

  describe('/todos (POST)', () => {
    const newTodo = {
      title: 'Test todo',
      description: 'Test todo description',
      dueDate: getTodayISOString(),
      status: Status.IN_PROGRESS,
    };

    it('should create a new todo', () => {
      return request(server)
        .post('/todos')
        .send(newTodo)
        .expect(HttpStatus.CREATED)
        .then((res) => {
          expect(res.body.title).toEqual(newTodo.title);
          expect(res.body.description).toEqual(newTodo.description);
          expect(res.body.dueDate).toEqual(newTodo.dueDate);
          expect(res.body.status).toEqual(newTodo.status);
        });
    });

    it('should return 400 when creating a todo with empty title', () => {
      const invalidTodo = {
        description: 'Test todo description',
        dueDate: getTodayISOString(),
        status: Status.IN_PROGRESS,
      };

      return request(server)
        .post('/todos')
        .send(invalidTodo)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should return 400 when creating a todo with invalid status', () => {
      const invalidTodo = {
        title: 'Test todo title',
        description: 'Test todo description',
        dueDate: getTodayISOString(),
        status: 'INVALID_STATUS',
      };

      return request(server)
        .post('/todos')
        .send(invalidTodo)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should return 400 when creating a todo with due date is not date string', () => {
      const invalidTodo = {
        title: 'Test todo title',
        description: 'Test todo description',
        dueDate: 'INVALID_DUE_DATE',
        status: Status.IN_PROGRESS,
      };

      return request(server)
        .post('/todos')
        .send(invalidTodo)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should return 400 when creating a todo with due date is past', () => {
      const invalidTodo = {
        title: 'Test todo title',
        description: 'Test todo description',
        dueDate: '2023-01-01T00:00:00.000Z',
        status: Status.IN_PROGRESS,
      };

      return request(server)
        .post('/todos')
        .send(invalidTodo)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('PUT /todos/:id', () => {
    it('should update a todo by id', async () => {
      const newTodo = {
        title: 'New todo',
        description: 'New todo description',
        dueDate: '2023-05-15T10:00:00.000Z',
        status: Status.IN_PROGRESS,
      };

      const createdTodo = await request(server)
        .post('/todos')
        .send(newTodo)
        .expect(201);

      const updatedTodo = {
        ...createdTodo.body,
        title: 'Updated todo',
        description: 'Updated todo description',
        dueDate: '2023-05-20T00:00:00.000Z',
        status: Status.COMPLETED,
      };

      await request(server)
        .put(`/todos/${createdTodo.body.id}`)
        .send(updatedTodo)
        .expect(204);

      const response = await request(server).get('/todos').expect(200);

      expect(response.body[0].title).toBe(updatedTodo.title);
      expect(response.body[0].description).toBe(updatedTodo.description);
      expect(new Date(response.body[0].dueDate).toISOString()).toBe(
        updatedTodo.dueDate,
      );
      expect(response.body[0].status).toBe(updatedTodo.status);
    });

    it('should return 400 if title is not provided', async () => {
      const newTodo = {
        description: 'New todo description',
        dueDate: '2023-05-15T10:00:00.000Z',
        status: Status.COMPLETED,
      };

      await request(server).put('/todos/1').send(newTodo).expect(400);
    });

    it('should return 400 if dueDate is in the past', async () => {
      const newTodo = {
        title: 'New todo',
        description: 'New todo description',
        dueDate: '2021-05-15T10:00:00.000Z',
        status: Status.COMPLETED,
      };

      await request(server).put('/todos/1').send(newTodo).expect(400);
    });

    it('should return 404 if todo with given id is not found', async () => {
      const updatedTodo = {
        title: 'Updated todo',
        description: 'Updated todo description',
        dueDate: getTodayISOString(),
        status: Status.COMPLETED,
      };

      await request(server).put('/todos/999').send(updatedTodo).expect(404);
    });
  });

  describe('DELETE /todos/:id', () => {
    let createdTodo: Todo;

    beforeEach(async () => {
      const todo = new Todo({
        id: '1',
        title: 'test title',
        description: 'test description',
        status: Status.TODO,
        dueDate: new Date('2023-01-01'),
      });
      await createTodoInDb(todo);
      createdTodo = todo;
    });

    it('should return 204 No Content', async () => {
      const response = await request(server).delete(`/todos/${createdTodo.id}`);
      expect(response.status).toBe(204);
    });

    it('should delete the todo from the database', async () => {
      await request(server).delete(`/todos/${createdTodo.id}`);
      const deletedTodo = await getTodoByIdFromDb(createdTodo.id);
      expect(deletedTodo).toBeUndefined();
    });

    it('should return 404 Not Found', async () => {
      const response = await request(app.getHttpServer()).delete('/todos/999');
      expect(response.status).toBe(404);
    });
  });

  async function createTodoInDb(todo: Todo): Promise<void> {
    const params = {
      TableName: testTableName,
      Item: {
        ID: { S: todo.id },
        Title: { S: todo.title },
        Description: { S: todo.description },
        Status: { S: todo.status },
        DueDate: { S: todo.formatDueDate },
      },
    };
    await ddbDocClient.send(new PutItemCommand(params));
  }

  async function deleteTodoFromDb(id: string): Promise<void> {
    const deleteParams = {
      TableName: testTableName,
      Key: {
        ID: { S: id },
      },
    };
    await ddbDocClient.send(new DeleteItemCommand(deleteParams));
  }

  async function getTodoByIdFromDb(id: string): Promise<Todo> {
    const params = {
      TableName: testTableName,
      Key: { ID: { S: id } },
    };
    const result = await ddbDocClient.send(new GetItemCommand(params));
    if (result.Item) {
      const todo = mappingToEntity(mappingToRecordModel(result.Item));
      return todo;
    }
  }
});
