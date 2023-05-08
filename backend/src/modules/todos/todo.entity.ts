class EntityGenerateFailure extends Error {
  constructor(e?: string) {
    super(e);
    this.name = new.target.name;
  }
}

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
    if (!obj.id)
      throw new EntityGenerateFailure(`id is required, but actual: ${obj.id}.`);
    if (!obj.title) {
      throw new EntityGenerateFailure(
        `title is required. but actual: ${obj.title}.`,
      );
    }
    if (!isValidStatus(obj.status))
      throw new EntityGenerateFailure(
        `Specify one of the following statuses: ${Object.values(
          Status,
        )}, but actual: ${obj.status}`,
      );

    this.id = obj.id;
    this.title = obj.title;
    this.description = obj.description;
    this.status = obj.status;
    this.dueDate = obj.dueDate;
    this.formatDueDate = this.dueDate
      ? new Date(this.dueDate).toISOString().slice(0, 10)
      : undefined;
  }

  update = (obj: {
    title: string;
    description?: string;
    status: Status;
    dueDate?: Date;
  }): Todo => {
    return new Todo({
      id: this.id,
      title: obj.title,
      description: obj.description,
      status: obj.status,
      dueDate: obj.dueDate,
    });
  };
}

export const Status = {
  TODO: 'todo',
  IN_PROGRESS: 'in progress',
  COMPLETED: 'completed',
} as const;

export type Status = (typeof Status)[keyof typeof Status];

const isValidStatus = (status: string): status is Status => {
  return Object.values(Status).includes(status as Status);
};
