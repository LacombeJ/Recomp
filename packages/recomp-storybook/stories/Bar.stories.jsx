import React from 'react';

import { Bar } from '@recomp/core';
import './stories.styl';

export default {
  title: 'Elements/Bar',
  component: Bar,
  argTypes: {},
};

const Template = (args) => <Bar {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  children: [
    <div className="bar-start">Bar Start</div>,
    <div className="bar-center">Bar Center</div>,
    <div className="bar-end">Bar End</div>,
  ],
};
