// import React from "react";
// import { useSetRecoilState } from "recoil";
// import { todoListState } from "../store";

// type TodoItemProps = {
//   id: number;
//   title: string;
//   description: string;
//   status: "todo" | "wip" | "in progress" | "done" | "completed";
// };

// const TodoItem: React.FC<TodoItemProps> = ({ id, title, description, status }) => {
//   const setTodoList = useSetRecoilState(todoListState);

//   const handleStatusChange = (newStatus: "todo" | "wip" | "in progress" | "done" | "completed") => {
//     setTodoList((oldTodoList) =>
//       oldTodoList.map((todo) => (todo.id === id ? { ...todo, status: newStatus } : todo))
//     );
//   };

//   const handleTitleChange = (newTitle: string) => {
//     setTodoList((oldTodoList) =>
//       oldTodoList.map((todo) => (todo.id === id ? { ...todo, title: newTitle } : todo))
//     );
//   };

//   const handleDescriptionChange = (newDescription: string) => {
//     setTodoList((oldTodoList) =>
//       oldTodoList.map((todo) => (todo.id === id ? { ...todo, description: newDescription } : todo))
//     );
//   };

//   const handleTitleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
//     const newTitle = event.target.value.trim();
//     if (newTitle !== title) {
//       handleTitleChange(newTitle);
//     }
//   };

//   const handleDescriptionBlur = (event: React.FocusEvent<HTMLTextAreaElement>) => {
//     const newDescription = event.target.value.trim();
//     if (newDescription !== description) {
//       handleDescriptionChange(newDescription);
//     }
//   };

//   return (
//     <>
//     <tr className={status === "completed" ? "completed" : ""}>
//       <td>
//         <input type="text" defaultValue={title} onBlur={handleTitleBlur} />
//       </td>
//       <td>
//         <textarea defaultValue={description} onBlur={handleDescriptionBlur} />
//       </td>
//       <td>
//         {(status === "todo" || status === "wip") && (
//           <button onClick={() => handleStatusChange("in progress")}>Start</button>
//         ) : todoItem.status === "in progress" ? (
//           <button
//             onClick={() => setTodoItem({ ...todoItem, status: "completed" })}
//           >
//             Finish
//           </button>
//         ) : todoItem.status === "completed" || todoItem.status === "done" ? (
//           <button onClick={() => setTodoItem({ ...todoItem, status: "todo" })}>
//             Reset
//           </button>
//         ) : null}
//       </td>
//     </tr>
//     </>
//   );
// }

// export default TodoItem;
