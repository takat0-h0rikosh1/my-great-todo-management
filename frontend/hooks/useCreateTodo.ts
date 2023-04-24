import { useSetRecoilState, useRecoilValue } from "recoil";
import { todosState } from "@/states/todosState";
import { Todo, Status } from "@/models/Todo";
import { todoServiceOnRestAPI } from "@/infrastructures/TodoServiceOnRestAPI";
import { TodoFormState } from "@/states/todoFormState";
import { searchFormState } from "@/states/searchFormState";

const useCreateTodo = () => {
  const setTodos = useSetRecoilState<Todo[]>(todosState);
  const formState = useRecoilValue(searchFormState);

  const doCreateTodo = async (data: TodoFormState) => {
    const { title, description, status, dueDate } = data;
    if (title && status && Object.values(Status).includes(status)) {
      try {
        await todoServiceOnRestAPI.createTodo({
          title: title,
          description: description,
          status: status,
          dueDate: dueDate,
        });
        const createdTodos = await todoServiceOnRestAPI.searchTodos(formState);
        setTodos(createdTodos);
      } catch (error) {
        console.error(error);
        throw new Error("Failed to create todo.");
      }
    } else {
      throw new Error("Failed to create a todo. The form values are invalid.");
    }
  };

  return doCreateTodo;
};

export default useCreateTodo;
