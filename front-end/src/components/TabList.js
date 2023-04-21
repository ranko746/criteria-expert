import * as React from 'react';
import { List, ListItem, ListItemButton, ListItemText, Divider, Collapse} from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

const CustomTabList = (props) => {
  const {
    answers,
    detailId,
    tabId,
    handleCollapseChange
  } = props;

  return (
    <List>
      {answers.map((row, index) => (
        row.status === tabId ?
          <div key={index}>
            <ListItemButton onClick={ () => handleCollapseChange(row.id)}>
              <ListItemText primary={ row.answer } />
              {detailId === row.id ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={ detailId === row.id } timeout="auto" unmountOnExit>
              <List>
                <ListItem sx={{ pl: 4 }}>
                  <ListItemText primary={ row.description } />
                </ListItem>
              </List>
            </Collapse>
            <Divider />
          </div>
        :
          <div key={index}></div>
      ))}
    </List>
  );
}

export default CustomTabList;