import { SearchFormState } from "./../states/searchFormState";
import { Todo } from "../models/Todo";
import { todoServiceOnRestAPI } from "@/infrastructures/TodoServiceOnRestAPI";

const useSearchTodos = () => {
  const doSearchTodos = async (data: SearchFormState): Promise<Todo[]> => {
    try {
      return await todoServiceOnRestAPI.searchTodos(data);
    } catch (error) {
      console.error(error);
      return [] as Todo[];
    }
  };

  return doSearchTodos;
};

export default useSearchTodos;
