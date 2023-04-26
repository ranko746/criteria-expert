import * as React from 'react';
import { List, ListItem, ListItemButton, ListItemText, Divider, Collapse} from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

const CustomTabList = (props) => {
  const {
    answers,
    detailAnswerId,
    tabId,
    handleCollapseChange
  } = props;

  let itemExist = false;

  return (
    <List>
        <div>
          {
            answers.map((row, index) => {
              if (row.status === tabId) {
                itemExist = true;
                return (
                  <div key={index}>
                    <ListItemButton onClick={ () => handleCollapseChange(row.id)}>
                      <ListItemText primary={ row.title } />
                      { detailAnswerId === row.id ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={ detailAnswerId === row.id } timeout="auto" unmountOnExit>
                      <List>
                        <ListItem sx={{ pl: 4, display: "block" }}>
                          <ListItemText primary={ row.description } />
                          <ListItemText primary={ row.link } sx={{ wordWrap: "break-word" }}/>
                        </ListItem>
                      </List>
                    </Collapse>
                    <Divider />
                  </div>
                );
              } else {
                return (
                  <div key={index}></div>
                );
              }
            }
          )}

          {
            !itemExist
            ?
            <ListItem>
              <ListItemText primary="No Answers" />
            </ListItem>
            :
            <></>
          }
          
        </div>
    </List>
  );
}

export default CustomTabList;