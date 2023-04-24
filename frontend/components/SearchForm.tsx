import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Stack,
  Typography,
} from "@mui/material";
import styled from "styled-components";
import { Status } from "@/models/Todo";
import { useRecoilState } from "recoil";
import { SearchFormState, searchFormState } from "@/states/searchFormState";

const StyledDiv = styled.div`
  margin: 20px;
`;

type SearchFromProps = {
  onSearch: (condition: SearchFormState) => Promise<void>;
};

const SearchForm: React.FC<SearchFromProps> = ({ onSearch }) => {
  const [formState, setFormState] = useRecoilState(searchFormState);

  const handleSearch = () => {
    onSearch(formState);
  };

  const onChange = (e: any) => {
    const target = e.target;
    const value = target.value;
    const name = target.name;
    setFormState({ ...formState, [name]: value });
  };

  return (
    <StyledDiv>
      <Stack direction="row" spacing={2}>
        <Typography>Filter: </Typography>
        <TextField
          label="title"
          name="title"
          value={formState.title}
          onChange={onChange}
        />
        <TextField
          label="description"
          name="description"
          value={formState.description}
          onChange={onChange}
        />
        <TextField
          label="due date from"
          name="dueDateFrom"
          type="date"
          value={formState.dueDateFrom}
          onChange={onChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="due date to"
          name="dueDateTo"
          type="date"
          value={formState.dueDateTo}
          onChange={onChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <FormControl sx={{ m: 1, minWidth: 120 }}>
          <InputLabel>status</InputLabel>
          <Select
            name="status"
            value={formState.status || ""}
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
        </FormControl>
        <Button variant="contained" color="primary" onClick={handleSearch}>
          Search
        </Button>
      </Stack>
    </StyledDiv>
  );
};

export default SearchForm;
