import { atom } from "recoil";
import { Status } from "../models/Todo";

export interface SearchFormState {
  title?: string;
  description?: string;
  dueDateFrom?: Date;
  dueDateTo?: Date;
  status?: Status;
}

export const searchFormState = atom<SearchFormState>({
  key: "searchFormState",
  default: {
    title: undefined,
    description: undefined,
    dueDateFrom: undefined,
    dueDateTo: undefined,
    status: undefined,
  },
});
