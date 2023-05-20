import React from 'react';

import { Scroll } from '@recomp/core';
import '../stories.scss';

export default {
  title: 'Containers/Scroll',
  component: Scroll,
  argTypes: {},
};

const Template = (args) => (
  <div className="scroll-container">
    <Scroll className="Scroll" {...args} />
  </div>
);

export const Basic = Template.bind({});
Basic.args = {
  scroll: 'y',
  scrollPolicy: 'scroll',
  children: (
    <div>
      <h1>Scroll</h1>
      Scroll widget
      <ol>
        <li>Item...</li>
        <li>Item...</li>
        <li>Item...</li>
        <li>Item...</li>
        <li>Item...</li>
        <li>Item...</li>
        <li>Item...</li>
        <li>Item...</li>
        <li>Item...</li>
        <li>Item...</li>
        <li>Item...</li>
        <li>Item...</li>
        <li>Item...</li>
      </ol>
    </div>
  ),
};
