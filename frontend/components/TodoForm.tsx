import React, { useEffect, useState } from "react";
import { Button, Modal, Typography } from "@mui/material";
import { Status } from "../models/Todo";
import styled from "styled-components";
import TodoFormContent from "./TodoFormContent";
import { isTodoFormValidState } from "@/states/todoFormValidateState";
import { useRecoilValue, useRecoilState, useResetRecoilState } from "recoil";
import {
  todoFormState,
  todoFormStateId,
  TodoFormState,
} from "@/states/todoFormState";

const StyledBox = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  background-color: #fff;
  border: 2px solid #000;
  box-shadow: 0px 0px 24px rgba(0, 0, 0, 0.2);
  padding: 16px;
`;

const StyledDiv = styled.div`
  div.create-todo {
    margin-left: 20px;
  }
`;

enum FormType {
  NEW = "new",
  EDIT = "edit",
}

type TodoFormProps = {
  formInitialValues: {
    id?: string;
    title?: string;
    description?: string;
    dueDate?: Date;
    status?: Status;
  };
  doMutateTodo: (_: TodoFormState) => Promise<void>;
};

const TodoForm: React.FC<TodoFormProps> = ({
  formInitialValues,
  doMutateTodo,
}: TodoFormProps) => {
  const [formStateId, setFormStateId] = useRecoilState(todoFormStateId);
  const formState = useRecoilValue(todoFormState(formStateId));
  const [modalState, setModalState] = useState(false);
  const isTodoValid = useRecoilValue(isTodoFormValidState);
  const formType = formInitialValues?.id ? FormType.EDIT : FormType.NEW;
  const formLabel = formType === FormType.EDIT ? "Update" : "Create";

  useEffect(() => {
    setFormStateId(formInitialValues.id);
  }, [modalState]);

  const onSubmit = async () => {
    doMutateTodo(formState).then(() => {
      setModalState(false);
    });
  };

  return (
    <StyledDiv>
      <div className="create-todo">
        <Button variant="contained" onClick={() => setModalState(true)}>
          {formLabel}
        </Button>
      </div>
      <Modal open={modalState} onClose={() => setModalState(false)}>
        <StyledBox>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Whould You Like {formLabel} todo?
          </Typography>
          <TodoFormContent formInitialValues={formInitialValues}>
            <Button
              variant="contained"
              color="inherit"
              onClick={() => {
                setModalState(false);
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!isTodoValid}
              onClick={onSubmit}
            >
              {formLabel}
            </Button>
          </TodoFormContent>
        </StyledBox>
      </Modal>
    </StyledDiv>
  );
};

export default TodoForm;
