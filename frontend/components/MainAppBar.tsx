import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import TodoForm from "./TodoForm";
import useCreateTodo from "@/hooks/useCreateTodo";

export default function MainAppBar() {
  const doCreateTodo = useCreateTodo();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="inherit">
        <Toolbar>
          <h2>Todo Management Application</h2>
          <TodoForm
            doMutateTodo={doCreateTodo}
            formInitialValues={{
              id: undefined,
              title: undefined,
              description: undefined,
              dueDate: undefined,
              status: undefined,
            }}
          />
        </Toolbar>
      </AppBar>
    </Box>
  );
}
