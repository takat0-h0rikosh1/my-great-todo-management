import { Todo, Status } from "@/models/Todo";
import appConfig from "@/config/AppConfig";

const JSON_CONTENT_TYPE = "application/json";

class TodoServiceOnRestAPI {
  readonly apiUrl: string;
  readonly authorization: string;

  constructor(apiUrl: string, authorization: string) {
    this.apiUrl = apiUrl;
    this.authorization = authorization;
  }

  async fetchTodos(): Promise<Todo[]> {
    const response = await fetch(this.apiUrl, {
      headers: {
        Authorization: this.authorization,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch todo list. Response status: ${response.status}`
      );
    }

    const data = await response.json();
    return data.map((x: any) => new Todo(x)) as Todo[];
  }

  async searchTodos(condition: {
    title?: string;
    description?: string;
    dueDateFrom?: Date;
    dueDateTo?: Date;
    status?: Status;
  }): Promise<Todo[]> {
    const queryParams = Object.entries(condition)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => {
        const v = value instanceof Date ? new Date(value).toISOString() : value;
        return `${encodeURIComponent(key)}=${encodeURIComponent(v)}`;
      })
      .join("&");

    const response = await fetch(`${this.apiUrl}?${queryParams}`, {
      headers: {
        Authorization: this.authorization,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to search todos. Response status: ${response.status}`
      );
    }

    const data = await response.json();
    return data.map((x: any) => new Todo(x)) as Todo[];
  }

  async createTodo(data: {
    title: string;
    description?: string;
    status: Status;
    dueDate?: Date;
  }): Promise<void> {
    return fetch(this.apiUrl, {
      method: "POST",
      headers: {
        Authorization: this.authorization,
        "Content-Type": JSON_CONTENT_TYPE,
      },
      body: JSON.stringify(data),
    }).then((response) => {
      if (!response.ok) {
        throw new Error(
          `Failed to create todo. Response status: ${response.status}`
        );
      }
    });
  }

  async updateTodo(todo: Todo): Promise<void> {
    return fetch(`${this.apiUrl}/${todo.id}`, {
      method: "PUT",
      headers: {
        Authorization: this.authorization,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todo),
    }).then((response) => {
      if (!response.ok) {
        throw new Error(
          `"failed update todo. response status: ${response.statusText}`
        );
      }
    });
  }

  async delete(id: string): Promise<void> {
    return fetch(`${this.apiUrl}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: this.authorization,
        "Content-Type": "application/json",
      },
    }).then((response) => {
      if (!response.ok) {
        throw new Error(
          `"failed delete todo. response status: ${response.statusText}`
        );
      }
    });
  }
}

export const todoServiceOnRestAPI = new TodoServiceOnRestAPI(
  `${appConfig.apiBaseUrl}/todos`,
  `Bearer ${appConfig.idToken}`
);
