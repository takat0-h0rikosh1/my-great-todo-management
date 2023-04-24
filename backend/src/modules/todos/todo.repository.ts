import { Todo } from './todo.entity';
import { SearchTodosRequest } from './service/request/search-todos.request';

interface TodoRepository {
  findAll: () => Promise<Todo[]>;
  findById: (id: string) => Promise<Todo>;
  findBy: (condition: SearchTodosRequest) => Promise<Todo[]>;
  store: (todo: Todo) => Promise<void>;
  deleteBy: (todo: Todo) => Promise<void>;
}

export default TodoRepository;
