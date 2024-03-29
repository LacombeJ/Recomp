import React from 'react';

import { useDialog, Dialog, Board, Button, Action } from '@recomp/core';
import { IconX } from '@tabler/icons-react';
import '../stories.scss';

export default {
  title: 'Elements/Dialog',
  component: Dialog,
  argTypes: {},
};

const Template = (args) => {
  const { setDialogRef, open, close } = useDialog();
  return (
    <div style={{ width: 400, height: 250 }}>
      <Dialog {...args} onClickBackdrop={close} setDialogRef={setDialogRef} />
      <Button onClick={open}>Open Dialog</Button>
    </div>
  );
};

export const Basic = Template.bind({});
Basic.args = {
  children: (
    <Board>
      <Board.Header>
        <Board.Title>Dialog</Board.Title>
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
    </Board>
  ),
};
