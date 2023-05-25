import React from 'react';

import { Button, Form } from '@recomp/core';
import '../stories.scss';

export default {
  title: 'Elements/Form',
  component: Form,
  argTypes: {},
};

const Template = (args) => (
  <div style={{ width: 400 }}>
    <Form {...args} />
  </div>
);

export const Basic = Template.bind({});
Basic.args = {
  children: [
    <React.Fragment key={'form'}>
      <Form.Row>
        <Form.Field>Form entry one: </Form.Field>
      </Form.Row>
      <Form.Row>
        <Form.Field>Form entry two: </Form.Field>
      </Form.Row>
      <Button>Submit</Button>
    </React.Fragment>,
  ],
};
