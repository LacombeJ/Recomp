import React from 'react';

import { DropCard } from '@recomp/core';
import './stories.styl';

export default {
  title: 'Widgets/DropCard',
  component: DropCard,
  argTypes: {},
};

const Template = (args) => <DropCard {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  title: 'DropCard',
  subtitle: 'A widget container with ability to expand/collapse visibility',
  children: (
    <div>
      <h3>Inside the dropcard</h3>
      Dropcards are useful in scenarios such as:
      <ul>
        <li>Shortening length of document</li>
        <li>Hiding spoilers</li>
        <li>Organizing content</li>
      </ul>
    </div>
  ),
};
