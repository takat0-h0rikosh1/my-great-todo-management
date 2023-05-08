import { useSetRecoilState, useRecoilValue } from "recoil";
import { todosState } from "@/states/todosState";
import { Todo } from "../models/Todo";
import { todoServiceOnRestAPI } from "@/infrastructures/TodoServiceOnRestAPI";
import { searchFormState } from "@/states/searchFormState";

const useDeleteTodo = () => {
  const setTodos = useSetRecoilState<Todo[]>(todosState);
  const formState = useRecoilValue(searchFormState);

  const doDeleteTodo = async (id: string) => {
    await todoServiceOnRestAPI.delete(id);
    const deletedTodos = await todoServiceOnRestAPI.searchTodos(formState);
    setTodos(deletedTodos);
  };

  return doDeleteTodo;
};

export default useDeleteTodo;
