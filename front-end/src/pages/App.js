import * as React from 'react';
import { Container, Box, Stack, Tab, TextField, Button, TableContainer, Table, TableHead, TableBody, TableCell, TableRow, Paper } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import styled from "styled-components";

export const Wrapper = styled(Container)`
  width: 80%;
  display: block;
  text-align: center;

  .question-area {
    width: 100%;
    align-items: center;
    display: inline-flex;
    margin-top: 100px;

    .MuiTextField-root {
      width: 100%;
    }

    .MuiButton-root {
      width: 150px;
      line-height: inherit;
      margin-left: 16px;
      padding: 16.5px 14px;
    }
  }

  .answer-list {
    margin-top: 20px;

    thead {
      background: lightgrey;
    }
  }
`;

function createData(content) {
  return { content };
}

const rows = [
  createData('Frozen yoghurt This is answer This is answer This is answer This is answer This is answer This is answer This is answer This is answer This is answer This is answer '),
  createData('Frozen yoghurt'),
  createData('Frozen yoghurt'),
  createData('Frozen yoghurt'),
  createData('Frozen yoghurt'),
  createData('Frozen yoghurt'),
  createData('Frozen yoghurt'),
];

const App = () => {
  const [value, setValue] = React.useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Wrapper>
      <Box className="question-area">
        <TextField
          hiddenLabel
          placeholder='Enter question'
          defaultValue=""
        />
        <Button 
          variant="outlined"
        >Submit</Button>
      </Box>
      <Box>
      <TableContainer component={Paper} className='answer-list'>
        <Table sx={{ width: "100%" }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align='center' width={"20%"}>ID</TableCell>
              <TableCell align="center">Content</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow
                key={index}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row" align="center">
                  { index + 1 }
                </TableCell>
                <TableCell align="center">{row.content}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      </Box>
    </Wrapper>
  );
}

export default App;