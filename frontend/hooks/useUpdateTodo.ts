import { useRecoilState, useRecoilValue } from "recoil";
import { todosState } from "@/states/todosState";
import { Todo, Status } from "@/models/Todo";
import { TodoFormState } from "@/states/todoFormState";
import { todoServiceOnRestAPI } from "@/infrastructures/TodoServiceOnRestAPI";
import { searchFormState } from "@/states/searchFormState";

const useUpdateTodo = () => {
  const [todos, setTodos] = useRecoilState<Todo[]>(todosState);
  const formState = useRecoilValue(searchFormState);

  const doUpdateTodo = async (data: TodoFormState) => {
    const { id, title, status } = data;
    if (id && title && status && Object.values(Status).includes(status)) {
      try {
        await todoServiceOnRestAPI.updateTodo(data as Todo);
        const updatedTodos = await todoServiceOnRestAPI.searchTodos(formState);
        setTodos(updatedTodos);
      } catch (error) {
        console.error(error);
        throw new Error("Failed to update todo.");
      }
    } else {
      throw new Error("Failed to update a todo. The form values are invalid.");
    }
  };

  return doUpdateTodo;
};

export default useUpdateTodo;
