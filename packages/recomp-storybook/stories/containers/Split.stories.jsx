import React from 'react';

import { Split, Stack } from '@recomp/core';
import '../stories.styl';

export default {
  title: 'Containers/Split',
  component: Split,
  argTypes: {},
};

const Template = (args) => <Split {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  children: [
    <Split.Item key="1">
      <div className="split-left">Left</div>
    </Split.Item>,
    <Split.Item key="2">
      <div className="split-right">Right</div>
    </Split.Item>,
  ],
};

export const Horizontal = Template.bind({});
Horizontal.args = {
  split: 'horizontal',
  children: [
    <Split.Item key="1">
      <div className="split-top">Top</div>
    </Split.Item>,
    <Split.Item key="2">
      <div className="split-bottom">Bottom</div>
    </Split.Item>,
  ],
};
