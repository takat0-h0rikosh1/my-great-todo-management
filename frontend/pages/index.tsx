import type { NextPage } from "next";
import { TodoList } from "@/components/TodoList";
import { useEffect } from "react";
import { Todo } from "@/models/Todo";
import { todosState } from "@/states/todosState";
import { useRecoilState } from "recoil";
import SearchForm from "@/components/SearchForm";
import useSearchTodos from "../hooks/useSearchTodos";
import useFetchTodos from "../hooks/useFetchTodos";
import { SearchFormState } from "@/states/searchFormState";

const Index: NextPage = () => {
  const [todos, setTodos] = useRecoilState<Todo[]>(todosState);
  const doSearchTodos = useSearchTodos();
  const doFetchTodos = useFetchTodos();

  useEffect(() => {
    doFetchTodos().then((x) => setTodos(x as Todo[]));
  }, []);

  const onSearch = async (condition: SearchFormState) => {
    doSearchTodos(condition).then(setTodos);
  };

  return (
    <>
      <SearchForm onSearch={onSearch} />
      <TodoList todos={todos as Todo[]} />
    </>
  );
};

export default Index;
