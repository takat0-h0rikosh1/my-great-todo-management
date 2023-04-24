import { atom } from "recoil";
import { Todo } from "../models/Todo";

export const todosState = atom<Todo[]>({
  key: "todosState",
  default: [],
});
