export const Status = {
  TODO: "todo",
  IN_PROGRESS: "in progress",
  COMPLETED: "completed",
} as const;

export type Status = (typeof Status)[keyof typeof Status];

export class Todo {
  readonly id: string;
  readonly title: string;
  readonly description?: string;
  readonly status: Status;
  readonly dueDate?: Date;
  readonly formatDueDate?: string;

  constructor(obj: {
    id: string;
    title: string;
    description?: string;
    status: Status;
    dueDate?: Date;
  }) {
    this.id = obj.id;
    this.title = obj.title;
    this.description = obj.description;
    this.status = obj.status;
    this.dueDate = obj.dueDate;
    this.formatDueDate = this.dueDate
      ? new Date(this.dueDate).toISOString().slice(0, 10)
      : undefined;
  }
}
