import { Todo, Status } from '../todo.entity';

export const mappingToRecordModel = (record: Record<string, any>) => {
  const todoRecord: TodoRecord = {
    ID: record.ID,
    Title: record.Title,
    Description: record.Description,
    DueDate: record.DueDate,
    Status: record.Status,
  };
  return todoRecord;
};

export const mappingToEntity = (record: TodoRecord) => {
  const todo: Todo = new Todo({
    id: record.ID.S,
    title: record.Title.S,
    description: record.Description ? record.Description.S : undefined,
    dueDate: record.DueDate ? new Date(record.DueDate.S) : undefined,
    status: record.Status ? (record.Status.S as Status) : undefined,
  });
  return todo;
};
