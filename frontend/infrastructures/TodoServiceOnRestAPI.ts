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
    const url = this.apiUrl;
    const params = {
      headers: {
        Authorization: this.authorization,
      },
    };

    try {
      const response = await fetch(url, params);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch todos. Response status: ${response.status}`
        );
      }

      return response.json().then((items) => {
        const todos = items.map((x: any) => new Todo(x));
        return todos as Todo[];
      });
    } catch (error) {
      throw new Error(
        "Unable to connect to the server. Please try again later."
      );
    }
  }

  async searchTodos(condition: {
    title?: string;
    description?: string;
    dueDateFrom?: Date;
    dueDateTo?: Date;
    status?: Status;
  }): Promise<Todo[]> {
    const queryString = Object.entries(condition)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => {
        const v = value instanceof Date ? new Date(value).toISOString() : value;
        return `${encodeURIComponent(key)}=${encodeURIComponent(v)}`;
      })
      .join("&");
    const url = `${this.apiUrl}?${queryString}`;
    const params = {
      headers: {
        Authorization: this.authorization,
      },
    };

    try {
      const response = await fetch(url, params);
      if (!response.ok) {
        throw new Error(
          `Failed to search todos. Response status: ${response.status}`
        );
      }

      return response.json().then((items) => {
        const todos = items.map((x: any) => new Todo(x));
        return todos as Todo[];
      });
    } catch (error) {
      console.error(error);
      throw new Error(
        "Unable to connect to the server. Please try again later."
      );
    }
  }

  async createTodo(data: {
    title: string;
    description?: string;
    status: Status;
    dueDate?: Date;
  }): Promise<void> {
    const url = this.apiUrl;
    const params = {
      method: "POST",
      headers: {
        Authorization: this.authorization,
        "Content-Type": JSON_CONTENT_TYPE,
      },
      body: JSON.stringify(data),
    };

    try {
      const response = await fetch(url, params);
      if (!response.ok) {
        throw new Error(
          `Failed to create todo. Response status: ${response.status}`
        );
      }
    } catch (error) {
      console.error(error);
      throw new Error(
        "Unable to connect to the server. Please try again later."
      );
    }
  }

  async updateTodo(todo: Todo): Promise<void> {
    const url = `${this.apiUrl}/${todo.id}`;
    const params = {
      method: "PUT",
      headers: {
        Authorization: this.authorization,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todo),
    };

    try {
      const response = await fetch(url, params);
      if (!response.ok) {
        throw new Error(
          `"failed update todo. response status: ${response.status}`
        );
      }
    } catch (error) {
      console.error(error);
      throw new Error(
        "Unable to connect to the server. Please try again later."
      );
    }
  }

  async delete(id: string): Promise<void> {
    const url = `${this.apiUrl}/${id}`;
    const params = {
      method: "DELETE",
      headers: {
        Authorization: this.authorization,
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await fetch(url, params);
      if (!response.ok) {
        throw new Error(
          `"failed delete todo. response status: ${response.status}`
        );
      }
    } catch (error) {
      console.error(error);
      throw new Error(
        "Unable to connect to the server. Please try again later."
      );
    }
  }
}

export const todoServiceOnRestAPI = new TodoServiceOnRestAPI(
  `${appConfig.apiBaseUrl}/todos`,
  `Bearer ${appConfig.idToken}`
);
