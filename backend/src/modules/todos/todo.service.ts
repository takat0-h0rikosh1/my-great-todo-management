import { SearchTodosRequest } from './service/request/search-todos.request';
import { Inject, Injectable } from '@nestjs/common';
import TodoRepository from './todo.repository';
import { Todo } from './todo.entity';
import { UpdateTodoRequest } from './service/request/update-todo.request';
import EntityNotFoundException from './exception/entity.not-found.exception';

@Injectable()
export default class TodoService {
  constructor(
    @Inject('TodoRepository')
    private repository: TodoRepository,
  ) {}

  async findAll(): Promise<Todo[]> {
    return this.repository.findAll();
  }

  async search(condition: SearchTodosRequest): Promise<Todo[]> {
    return this.repository.findBy(condition);
  }

  async create(todo: Todo): Promise<Todo> {
    return await this.repository.store(todo).then(() => todo);
  }

  async update(request: UpdateTodoRequest): Promise<void> {
    return this.repository
      .findById(request.id)
      .then((x) => {
        if (!x) throw new EntityNotFoundException(request.id);
        return x.update(request);
      })
      .then((x) => this.repository.store(x));
  }

  async deleteBy(id: string): Promise<void> {
    return this.repository
      .findById(id)
      .then((x) => {
        if (!x) throw new EntityNotFoundException(id);
        return x;
      })
      .then((x) => this.repository.deleteBy(x));
  }
}
