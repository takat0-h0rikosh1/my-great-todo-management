import { Status } from '../../todo.entity';

export interface UpdateTodoRequest {
  id: string;
  title: string;
  description?: string;
  dueDate?: Date;
  status: Status;
}
