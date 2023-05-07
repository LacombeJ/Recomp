import React from 'react';

import { ScrollPane } from '@recomp/core';
import './stories.styl';

export default {
  title: 'Widgets/ScrollPane',
  component: ScrollPane,
  argTypes: {},
};

const Template = (args) => (
  <div className="scroll-container">
    <ScrollPane className="scrollpane" {...args} />
  </div>
);

export const Basic = Template.bind({});
Basic.args = {
  scroll: 'y',
  scrollPolicy: 'scroll',
  children: (
    <div>
      <h1>ScrollPane</h1>
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
