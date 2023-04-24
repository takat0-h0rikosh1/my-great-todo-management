import { useSetRecoilState, useRecoilValue } from "recoil";
import { todosState } from "@/states/todosState";
import { Todo } from "../models/Todo";
import { todoServiceOnRestAPI } from "@/infrastructures/TodoServiceOnRestAPI";
import { searchFormState } from "@/states/searchFormState";

const useDeleteTodo = () => {
  const setTodos = useSetRecoilState<Todo[]>(todosState);
  const formState = useRecoilValue(searchFormState);

  const doDeleteTodo = async (id: string) => {
    todoServiceOnRestAPI.delete(id).then(() => {
      todoServiceOnRestAPI.fetchTodos().then((x) => {
        setTodos(x);
      });
    });

    try {
      await todoServiceOnRestAPI.delete(id);
      const deletedTodos = await todoServiceOnRestAPI.searchTodos(formState);
      setTodos(deletedTodos);
    } catch (error) {
      console.error(error);
      throw new Error("Failed to delete todo.");
    }
  };

  return doDeleteTodo;
};

export default useDeleteTodo;
