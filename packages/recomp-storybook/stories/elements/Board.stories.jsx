import React from 'react';

import { Board, Button, Action } from '@recomp/core';
import { IconX } from '@tabler/icons-react';
import '../stories.scss';

export default {
  title: 'Elements/Board',
  component: Board,
  argTypes: {},
};

const Template = (args) => (
  <div style={{ width: 400, height: 250 }}>
    <Board {...args} />
  </div>
);

export const Basic = Template.bind({});
Basic.args = {
  children: (
    <React.Fragment>
      <Board.Header>
        <Board.Title>Board</Board.Title>
        <Board.Control>
          <Action>
            <IconX size={20} stroke="3"></IconX>
          </Action>
        </Board.Control>
      </Board.Header>
      <Board.Body>...</Board.Body>
      <Board.Footer>
        <Button variant="warn">Decline</Button>
        <Button variant="primary">Confirm</Button>
      </Board.Footer>
    </React.Fragment>
  ),
};
