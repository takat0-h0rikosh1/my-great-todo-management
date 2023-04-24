import { selector } from "recoil";
import { todoFormState, todoFormStateId } from "./todoFormState";

export const titleErrorMessageState = selector<string | undefined>({
  key: "titleErrorMessageState",
  get: ({ get }) => {
    const title = get(todoFormState(get(todoFormStateId))).title;
    return !title ? "Title is required." : undefined;
  },
});

export const dueDateErrorMessageState = selector<string | undefined>({
  key: "dueDateErrorMessageState",
  get: ({ get }) => {
    const dueDate = get(todoFormState(get(todoFormStateId))).dueDate;
    const getJapanStandardTimeDate = (date: Date) => {
      date.setHours(0, 0, 0, 0);
      date.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });
      return date.getTime();
    };

    return dueDate &&
      getJapanStandardTimeDate(new Date(dueDate)) <
        getJapanStandardTimeDate(new Date())
      ? "Past dates cannot be specified."
      : undefined;
  },
});

export const statusErrorMessageState = selector<string | undefined>({
  key: "statusErrorMessageState",
  get: ({ get }) => {
    const formId = get(todoFormStateId);
    const status = get(todoFormState(get(todoFormStateId))).status;
    return !status ? "Status is required." : undefined;
  },
});

export const isTodoFormValidState = selector<boolean>({
  key: "isTodoFormValidState",
  get: ({ get }) => {
    return [
      get(titleErrorMessageState),
      get(dueDateErrorMessageState),
      get(statusErrorMessageState),
    ].every((x) => x === undefined);
  },
});
