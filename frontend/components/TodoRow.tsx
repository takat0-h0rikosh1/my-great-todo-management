import React from "react";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { Todo } from "@/models/Todo";
import TodoForm from "./TodoForm";
import useUpdateTodo from "@/hooks/useUpdateTodo";
import useDeleteTodo from "@/hooks/useDeleteTodo";
import { Button, Grid } from "@mui/material";

type Props = {
  row: Todo;
};

export const TodoRow: React.FC<Props> = ({ row }) => {
  const doUpdateTodo = useUpdateTodo();
  const doDeleteTodo = useDeleteTodo();

  const handleDelete = async () => {
    return await doDeleteTodo(row.id).then(() => {});
  };

  return (
    <TableRow
      key={row.id}
      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
    >
      <TableCell component="th" scope="row">
        {row.title}
      </TableCell>
      <TableCell>{row.description}</TableCell>
      <TableCell>{row.status}</TableCell>
      <TableCell>{row.formatDueDate}</TableCell>
      <TableCell>
        <Grid container spacing={2}>
          <Grid item>
            <TodoForm formInitialValues={row} doMutateTodo={doUpdateTodo} />
          </Grid>
          <Grid item>
            <Button variant="contained" color="inherit" onClick={handleDelete}>
              Delete
            </Button>
          </Grid>
        </Grid>
      </TableCell>
    </TableRow>
  );
};

export default TodoRow;
