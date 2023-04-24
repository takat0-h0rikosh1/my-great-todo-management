import { Status } from '../../todo.entity';

export class SearchTodosRequest {
  title?: string;
  description?: string;
  dueDateFrom?: Date;
  dueDateTo?: Date;
  status?: Status;
}
