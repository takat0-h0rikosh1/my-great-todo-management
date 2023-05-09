import { Todo } from "../models/Todo";
import { todoServiceOnRestAPI } from "@/infrastructures/TodoServiceOnRestAPI";

const useFetchTodos = () => {
  const doFetchTodos = async (): Promise<Todo[]> => {
    try {
      return await todoServiceOnRestAPI.fetchTodos();
    } catch (error) {
      console.error(error);
      return [] as Todo[];
    }
  };

  return doFetchTodos;
};

export default useFetchTodos;
