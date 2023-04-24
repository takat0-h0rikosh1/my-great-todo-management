import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TodoRow from "./TodoRow";
import { Todo } from "@/models/Todo";
import styled from "styled-components";

const StyledDiv = styled.div`
  margin: 20px;
`;

type TodoListProps = {
  todos: Todo[];
};

export const TodoList: React.FC<TodoListProps> = ({ todos }) => {
  return (
    <StyledDiv>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {todos.map((row, index) => (
              <TodoRow key={index} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </StyledDiv>
  );
};
