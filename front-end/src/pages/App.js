import * as React from 'react';
import axios from "axios";
import { Container, Box, Stack, TextField, Button, ButtonGroup, Tab, List, ListSubheader, ListItem, ListItemText, Divider, CircularProgress, Typography} from '@mui/material';
import { TabList, TabPanel, TabContext } from '@mui/lab';
import styled from "styled-components";
import CustomTabList from '../components/TabList';

const ANSWER_STATUS = {
  NONE: '0',
  YES: '1',
  MAYBE: '2',
  NO: '3',
}

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

      .MuiCircularProgress-root {
        width: 23px !important;
        height: 23px  !important;
      }
    }
  }

  .answer-area {
    margin: 20px 0;

    .answer-list {
      width: 50%;

      .MuiListSubheader-root {
        color: #0079C1;
        font-size: 20px;
        text-align: left;
      }

      li {
        display: block;

        .MuiButtonGroup-root {
          display: block;
          text-align: right;

          button {
            height: 25px;
            font-size: 11px;
          }

          button.active {
            background: #0079C1;
            color: white;
          }
        }
      }
    }

    .categories {
      width: 50%;

      .tab-header {
        border-bottom: 1px solid rgba(0, 0, 0, 0.12);
      }

      .MuiTabPanel-root {
        padding: 0;
      }
    }
  }
`;

const App = () => {
  const base_url = 'http://localhost:5000/api/v1';
  
  const [tabId, setTabId] = React.useState(ANSWER_STATUS.YES);
  const [question, setQuestion] = React.useState('');
  const [questionId, setQuestionId] = React.useState(0);
  const [detailId, setDetailId] = React.useState(0);

  const [answers, setAnswers] = React.useState([]);
  const [answersFromDB, setAnswersFromDB] = React.useState([]);

  const [isLoading, setIsLoading] = React.useState(false);
  const [inputError, setInputError] = React.useState(false);

  const handleTabChange = (event, newValue) => {
    setDetailId(0);
    setTabId(newValue);
  };

  const handleCollapseChange = (newValue) => {
    setDetailId(detailId === newValue ? 0 : newValue);
    console.log(detailId);
  };

  const handleSaveAnswer = async (index, status) => {
    const answer = answers[index];
    
    console.log("q_id, title, description", questionId, answer.title, answer.description);
    try {
      let res = await axios.post(
        base_url + '/answer', 
        {
          q_id: questionId,
          title: answer.title,
          description: answer.description,
          link: answer.link,
          status: status,
        }
      );
      
      let data = res.data.data;
      console.log(data);
    
      setAnswersFromDB(data);

      const _answers = answers.map((el, idx)=>{
        if (idx === index) return {...el, status: status}
        return el
      })
      setAnswers(_answers)
      
    } catch (error) {
      console.error("Something went wrong.");
      console.error(error);
    }
  };

  const handleQueryChange = (event) => {
    setQuestion(event.target.value);
  };

  const handleFocusChange = (event) => {
    setInputError(false);
  };

  const handleSubmit = () => {
    if (question === '') {
      setInputError(true);
      return;
    }

    setAnswers([]);

    getAiAnswers();

    getAnswersByQuestion();
  }

  const getAiAnswers = async () => {
    setIsLoading(true);

    const questionTemplatePrefix = 'Here is one question. "';
    const questionTemplateSuffix = '". write 5 answers, descriptions with link of each answer for this question. the output should be array of objects in javascript and sorted by answer with alphabetical. and the each item of outputs should have "id", "title" which means answer and "description" which means detail info of each answer.  this is a style. [{id: 1, title: "XXX", description: "YYY", link: "ZZZ"}] write only json array without any description and explanation.';
    
    try {
      let res = await axios.post(
        base_url + '/ai/getAnswer', 
        {
          question: questionTemplatePrefix + question + questionTemplateSuffix
        }
      );
      
      let data = res.data ;
      console.log(data);
    
      setDetailId(0);
      setAnswers(JSON.parse(data.message));
    } catch (error) {
      console.error("Something went wrong.");
      console.error(error);
    }
    
    setIsLoading(false);
  }

  const getAnswersByQuestion = async () => {
    try {
      let res = await axios.post(
        base_url + '/question/findByTitle',
        {
          title: question
        }
      );

      let data = res.data.data;
      console.log("data => ", data);
      console.log("data.q_id => ", data.q_id);
      console.log("data.answers => ", data.answers);

      setQuestionId(data.q_id);
      setAnswersFromDB(data.answers);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Wrapper>
      <Box className="question-area">
        <TextField
          hiddenLabel
          error={ inputError }
          placeholder='Enter question'
          defaultValue={ question }
          onFocus={ handleFocusChange }
          onChange={ handleQueryChange }
        />
        <Button 
          variant="contained"
          disabled={ isLoading }
          onClick={ handleSubmit }
        >{ isLoading ? <CircularProgress /> : <Typography>Submit</Typography> }</Button>
      </Box>

      <Stack 
        direction='row' 
        spacing={ 8 } 
        className='answer-area' 
        divider={<Divider orientation="vertical" flexItem />}
      >
        <List 
          className='answer-list'
          subheader={
            <>
              <ListSubheader>Answers</ListSubheader>
              <Divider />
            </>
          }
        >
          {answers.map((row, index) => (
            row.status === undefined || row.status === ANSWER_STATUS.NONE
            ?
              <div key={index}>
                <ListItem >
                  <ListItemText primary={ row.title } />
                  <ButtonGroup variant="outlined" aria-label="outlined button group">
                      <Button className={ row.status === ANSWER_STATUS.YES ? 'active' : '' } onClick={ ()=> handleSaveAnswer(index, ANSWER_STATUS.YES) }>Yes</Button>
                      <Button className={ row.status === ANSWER_STATUS.MAYBE ? 'active' : '' } onClick={ ()=>handleSaveAnswer(index, ANSWER_STATUS.MAYBE) }>Maybe</Button>
                      <Button className={ row.status === ANSWER_STATUS.NO ? 'active' : '' } onClick={ ()=> handleSaveAnswer(index, ANSWER_STATUS.NO) }>No</Button>
                    </ButtonGroup>
                </ListItem>
                <Divider />
              </div>
            :
            null
          ))}
        </List>
        
        <Box className="categories">
          <TabContext value={tabId}>
            <Box className="tab-header">
              <TabList onChange={handleTabChange} >
                <Tab label="Yes" value={ ANSWER_STATUS.YES } />
                <Tab label="Maybe" value={ ANSWER_STATUS.MAYBE } />
                <Tab label="No" value={ ANSWER_STATUS.NO } />
              </TabList>
            </Box>
            <TabPanel value={ ANSWER_STATUS.YES }>
              <CustomTabList
                answers={ answersFromDB }
                detailId={ detailId }
                tabId={ ANSWER_STATUS.YES }
                handleCollapseChange= { handleCollapseChange }
              />
            </TabPanel>
            <TabPanel value={ ANSWER_STATUS.MAYBE }>
              <CustomTabList
                answers={ answersFromDB }
                detailId={ detailId }
                tabId={ ANSWER_STATUS.MAYBE }
                handleCollapseChange= { handleCollapseChange }
              />
            </TabPanel>
            <TabPanel value={ ANSWER_STATUS.NO }>
              <CustomTabList
                answers={ answersFromDB }
                detailId={ detailId }
                tabId={ ANSWER_STATUS.NO }
                handleCollapseChange= { handleCollapseChange }
              />
            </TabPanel>
          </TabContext>
        </Box>
      </Stack>
    </Wrapper>
  );
}

export default App;