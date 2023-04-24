import React, { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  TextField,
  Box,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  FormControl,
} from "@mui/material";
import { Status } from "../models/Todo";
import {
  titleErrorMessageState,
  dueDateErrorMessageState,
  statusErrorMessageState,
} from "@/states/todoFormValidateState";
import { todoFormStateId, todoFormState } from "@/states/todoFormState";

type FormInitialValues = {
  id?: string;
  title?: string;
  description?: string;
  dueDate?: Date;
  status?: Status;
};

type TodoFormContentProps = {
  formInitialValues: FormInitialValues;
  children: React.ReactNode;
};

const TodoFormContent: React.FC<TodoFormContentProps> = ({
  formInitialValues,
  children,
}) => {
  const [formStateId, setFormStateId] = useRecoilState(todoFormStateId);
  const [formStateValue, setFormState] = useRecoilState(
    todoFormState(formStateId)
  );
  const titleErrorMessage = useRecoilValue(titleErrorMessageState);
  const dueDateErrorMessage = useRecoilValue(dueDateErrorMessageState);
  const statusErrorMessage = useRecoilValue(statusErrorMessageState);

  const formatDate = (date: Date) => {
    return new Date(date).toISOString().slice(0, 10);
  };

  useEffect(() => {
    setFormStateId(formInitialValues.id);
    setFormState(formInitialValues);
  }, []);

  const onChange = (e: any) => {
    const target = e.target;
    const value = target.value;
    const name = target.name;
    setFormState({ ...formStateValue, [name]: value });
  };

  return (
    <Box>
      <Box mb={2}>
        <FormControl fullWidth>
          <TextField
            label="title"
            name="title"
            value={formStateValue?.title || ""}
            onChange={onChange}
            required
          />
          <FormHelperText error={Boolean(titleErrorMessage)}>
            {titleErrorMessage}
          </FormHelperText>
        </FormControl>
      </Box>
      <Box mb={2}>
        <FormControl fullWidth>
          <TextField
            label="description"
            name="description"
            value={formStateValue?.description || ""}
            onChange={onChange}
          />
        </FormControl>
      </Box>
      <Box mb={2}>
        <FormControl fullWidth>
          <TextField
            id="dueDate"
            label="dueDate"
            type="date"
            name="dueDate"
            value={
              formStateValue?.dueDate ? formatDate(formStateValue.dueDate) : ""
            }
            onChange={onChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <FormHelperText error={Boolean(dueDateErrorMessage)}>
            {dueDateErrorMessage}
          </FormHelperText>
        </FormControl>
      </Box>

      <Box mb={2}>
        <FormControl fullWidth>
          <InputLabel id="status-select-label">status</InputLabel>
          <Select
            labelId="status-select-label"
            id="status-select"
            name="status"
            label="status"
            value={formStateValue?.status || ""}
            onChange={onChange}
          >
            {Object.values(Status).map((x: string) => {
              return (
                <MenuItem key={x} value={x}>
                  {x}
                </MenuItem>
              );
            })}
          </Select>
          <FormHelperText error={Boolean(statusErrorMessage)}>
            {statusErrorMessage}
          </FormHelperText>
        </FormControl>
      </Box>
      <Box mt={2} display="flex" justifyContent="flex-end">
        {children}
      </Box>
    </Box>
  );
};

export default TodoFormContent;
