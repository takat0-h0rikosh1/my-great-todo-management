import { atom, atomFamily } from "recoil";
import { Status, Todo } from "../models/Todo";

export interface TodoFormState {
  id?: string;
  title?: string;
  description?: string;
  status?: Status;
  dueDate?: Date;
}

export const todoFormStateId = atom<string | undefined>({
  key: "todoFormState",
  default: undefined,
});

export const todoFormState = atomFamily<TodoFormState, string | undefined>({
  key: "todoFormState",
  default: {
    id: undefined,
    title: undefined,
    description: undefined,
    status: undefined,
    dueDate: undefined,
  },
});
