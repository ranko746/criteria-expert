import * as React from 'react';
import axios from "axios";
import { Container, Box, TextField, Button, TableContainer, Table, TableHead, TableBody, TableCell, TableRow, Paper } from '@mui/material';
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
    margin: 20px 0;

    thead {
      background: lightgrey;
    }
  }
`;

const App = () => {
  const base_url = 'http://localhost:4000/api/getAnswer';

  const [value, setValue] = React.useState('1');
  const [question, setQuestion] = React.useState('');
  const [answers, setAnswers] = React.useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleQueryChange = (event) => {
    console.log(event.target.value);
    setQuestion(event.target.value);
  };

  const handleSubmit = async () => {
    const questionTemplatePrefix = 'Here is one question. "';
    const questionTemplateSuffix = `"
    give me 50 answers for this question. the output will be json array string like following:
    [{content: 'XXX'},
    {content: 'XXXX'},
    ... ,
    {content: 'XXXX'}]`;
    let res = await axios.post(
      base_url, 
      {
        question: questionTemplatePrefix + question + questionTemplateSuffix
      }
    );
    let data = res.data ;
    console.log("response data ===> ", data);
    setAnswers(JSON.parse(data.message))
  }

  return (
    <Wrapper>
      <Box className="question-area">
        <TextField
          hiddenLabel
          placeholder='Enter question'
          defaultValue={ question }
          onChange={ handleQueryChange }
        />
        <Button 
          variant="outlined"
          onClick={ handleSubmit }
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
            {answers.map((row, index) => (
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