import React from 'react';

import { Block } from '@recomp/core';
import '../stories.styl';

export default {
  title: 'Elements/Block',
  component: Block,
  argTypes: {},
};

const Template = (args) => <Block {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  children: (
    <div>
      <h2>Block</h2>
      This is a block element. It's a container that's great for many uses
      including...
      <ol>
        <li>Focusing attention to some particular note or comment</li>
        <li>Organizing in nested structure</li>
        <li>Separating sections in a document</li>
      </ol>
    </div>
  ),
};

export const Nested = Template.bind({});
Nested.args = {
  children: (
    <div>
      <h2>Nested Blocks</h2>
      If it's raining:
      <Block>Go to sleep</Block>
      Else:
      <Block>
        If there is gas in the car:
        <Block>
          <div>Go to the gas station</div>
          <div>If you are hungry:</div>
          <Block>
            <div>Buy some snacks</div>
            <div>If you are thirsty:</div>
            <Block>Buy some drinks</Block>
          </Block>
          <div>Fill up on gas</div>
          <div>
            Go home, beach parking isn't cheap and you spent enough money for
            the day
          </div>
        </Block>
        Else:
        <Block>Go to the beach</Block>
      </Block>
    </div>
  ),
};
