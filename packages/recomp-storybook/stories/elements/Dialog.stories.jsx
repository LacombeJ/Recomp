import React from 'react';

import { Dialog, Button, Action } from '@recomp/core';
import { IconX } from '@tabler/icons-react';
import '../stories.scss';

export default {
  title: 'Elements/Dialog',
  component: Dialog,
  argTypes: {},
};

const Template = (args) => (
  <div style={{ width: 400, height: 250 }}>
    <Dialog {...args} />
  </div>
);

export const Basic = Template.bind({});
Basic.args = {
  children: (
    <React.Fragment>
      <Dialog.Header>
        <Dialog.Title>Dialog</Dialog.Title>
        <Dialog.Control>
          <Action>
            <IconX size={20} stroke="3"></IconX>
          </Action>
        </Dialog.Control>
      </Dialog.Header>
      <Dialog.Body>...</Dialog.Body>
      <Dialog.Footer>
        <Button variant="warn">Decline</Button>
        <Button variant="primary">Confirm</Button>
      </Dialog.Footer>
    </React.Fragment>
  ),
};
