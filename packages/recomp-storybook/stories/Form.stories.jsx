import React from 'react';

import { Form } from '@recomp/core';
import './stories.styl';

export default {
  title: 'Example/Form',
  component: Form,
  argTypes: {},
};

const Template = (args) => <Form {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  children: [
    <React.Fragment>
      <div>
        Form entry one: <input></input>
      </div>
      <div>
        Form entry two: <input></input>
      </div>
      <div>
        <button>Submit Form</button>
      </div>
    </React.Fragment>,
  ],
};
