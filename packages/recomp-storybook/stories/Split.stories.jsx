import React from 'react';

import { Split } from '@recomp/core';
import './stories.styl';

export default {
  title: 'Widgets/Split',
  component: Split,
  argTypes: {},
};

const Template = (args) => (
  <div className="split-container">
    <Split {...args} />
  </div>
);

export const Basic = Template.bind({});
Basic.args = {
  children: [
    <Split.Item minSize={100}>
      <div className='split-left'>Left</div>
    </Split.Item>,
    <Split.Item minSize={100}>
      <div className='split-right'>Right</div>
    </Split.Item>,
  ],
};
