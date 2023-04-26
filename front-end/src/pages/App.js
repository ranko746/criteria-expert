import * as React from 'react';
import axios from "axios";
import { Container, Box, Stack, TextField, Button, ButtonGroup, Tab, List, ListSubheader, ListItemButton, ListItem, ListItemText, Divider, CircularProgress, Typography, Collapse} from '@mui/material';
import { TabList, TabPanel, TabContext } from '@mui/lab';
import styled from "styled-components";
import CustomTabList from '../components/CustomTabList';

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

  const [detailQuestionId, setDetailQuestionId] = React.useState(0);
  const [detailAnswerId, setDetailAnswerId] = React.useState(0);

  const [questions, setQuestions] = React.useState([]);
  const [answers, setAnswers] = React.useState([]);
  const [answersFromDB, setAnswersFromDB] = React.useState([]);

  const [isLoading, setIsLoading] = React.useState(false);
  const [inputError, setInputError] = React.useState(false);

  const handleTabChange = (event, newValue) => {
    setDetailAnswerId(0);
    setTabId(newValue);
  };

  const handleCollapseChange = (newValue) => {
    setDetailAnswerId(detailAnswerId === newValue ? 0 : newValue);
    console.log(detailAnswerId);
  };

  // save answer
  const handleSaveAnswer = async (questionIndex, answerIndex, status) => {
    const answer = questions[questionIndex]["answers"][answerIndex];
    
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

      let _questions = questions;
      _questions[questionIndex]['answers'][answerIndex].status = status;
      setQuestions(_questions);

      // const _answers = answers.map((el, idx)=>{
      //   if (idx === index) return {...el, status: status}
      //   return el
      // })
      // setAnswers(_answers)
      
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

    setDetailAnswerId(0);
    setQuestions([]);

    getSimilarQuestions(question);
  }

  // filter similar questions to the input question from db.
  const getSimilarQuestions = async (question) => {
    try {
      let res = await axios.post(
        base_url + '/question/getSimilarQuestions',
        {
          title: question
        }
      );

      let data = res.data.data;
      console.log("data.q_id => ", data.q_id);
      console.log("data.questions => ", data.questions);

      setQuestionId(data.q_id);

      let questionListItems = [];
      data.questions.map((item, index) => {
        let listItem = {
          question: item,
          answers: []
        };
        questionListItems.push(listItem);
      })

      console.log("questionListItems => ", questionListItems);
      setQuestions(questionListItems);

      getAiAnswers(questionListItems);

      getAnswersByQuestion(questionId);
    } catch (error) {
      console.error(error);
    }
  }

  // get answers from chatgpt
  const getAiAnswers = async (questionItems) => {
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
      let aiAnswers =  JSON.parse(data.message);
      console.log(data);

      console.log("questions => ", questions);  

      let tempListItems = [];
      questionItems.map((item, index) => {
        if (index === 0) {
          tempListItems.push({
            question: item.question,
            answers: aiAnswers
          })
        } else {
          tempListItems.push({
            question: item.question,
            answers: []
          })
        }
      })

      setQuestions(tempListItems);
    } catch (error) {
      console.error("Something went wrong.");
      console.error(error);
    }
    
    setIsLoading(false);
  }

  // Get answers for question from db
  const getAnswersByQuestion = async (q_id) => {
    try {
      let res = await axios.get(
        base_url + '/answer/findByQId',
        {
          params: {
            q_id: q_id
          }
        }
      );

      let data = res.data.data;
      console.log("data.answers => ", data.answers);

      setDetailQuestionId(q_id);
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
              <ListSubheader>Questions</ListSubheader>
              <Divider />
            </>
          }
        >
          {questions.map((question, question_index) => (
            <div key={ question_index }>
              <ListItemButton selected={ question.question.id === detailQuestionId } onClick={ () => getAnswersByQuestion(question.question.id) }>
                <ListItemText primary={ question.question.title } />
              </ListItemButton>
              <Divider></Divider>

              {question.answers.map((answer, answer_index) => (
                answer.status === undefined || answer.status === ANSWER_STATUS.NONE
                ?
                  <div key={ answer_index }>
                    <ListItem sx={{ pl: 4, display: "block" }}>
                      <ListItemText primary={ answer.title } />
                      <ButtonGroup variant="outlined" aria-label="outlined button group">
                          <Button className={ answer.status === ANSWER_STATUS.YES ? 'active' : '' } onClick={ ()=> handleSaveAnswer(question_index, answer_index, ANSWER_STATUS.YES) }>Yes</Button>
                          <Button className={ answer.status === ANSWER_STATUS.MAYBE ? 'active' : '' } onClick={ ()=>handleSaveAnswer(question_index, answer_index, ANSWER_STATUS.MAYBE) }>Maybe</Button>
                          <Button className={ answer.status === ANSWER_STATUS.NO ? 'active' : '' } onClick={ ()=> handleSaveAnswer(question_index, answer_index, ANSWER_STATUS.NO) }>No</Button>
                        </ButtonGroup>
                    </ListItem>
                    <Divider sx={{ ml: 4, display: "block" }}></Divider>
                  </div>
                :
                null
              ))}
            </div>
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
                detailAnswerId={ detailAnswerId }
                tabId={ ANSWER_STATUS.YES }
                handleCollapseChange= { handleCollapseChange }
              />
            </TabPanel>
            <TabPanel value={ ANSWER_STATUS.MAYBE }>
              <CustomTabList
                answers={ answersFromDB }
                detailAnswerId={ detailAnswerId }
                tabId={ ANSWER_STATUS.MAYBE }
                handleCollapseChange= { handleCollapseChange }
              />
            </TabPanel>
            <TabPanel value={ ANSWER_STATUS.NO }>
              <CustomTabList
                answers={ answersFromDB }
                detailAnswerId={ detailAnswerId }
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