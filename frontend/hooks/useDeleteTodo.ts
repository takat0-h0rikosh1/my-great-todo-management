import { useSetRecoilState, useRecoilValue } from "recoil";
import { todosState } from "@/states/todosState";
import { Todo } from "../models/Todo";
import { todoServiceOnRestAPI } from "@/infrastructures/TodoServiceOnRestAPI";
import { searchFormState } from "@/states/searchFormState";
import result from "postcss/lib/result";

const useDeleteTodo = () => {
  const setTodos = useSetRecoilState<Todo[]>(todosState);
  const formState = useRecoilValue(searchFormState);

  const doDeleteTodo = async (id: string) => {
    try {
      await todoServiceOnRestAPI.delete(id);
      const result = await todoServiceOnRestAPI.searchTodos(formState);
      setTodos(result);
    } catch (error) {
      console.error(error);
    }
  };

  return doDeleteTodo;
};

export default useDeleteTodo;
