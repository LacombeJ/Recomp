import React from 'react';

import { Text } from '@recomp/core';
import '../stories.scss';

export default {
  title: 'Elements/Text',
  component: Text,
  argTypes: {},
};

const Template = (args) => <Text {...args} />;

const TemplateAll = (args) => (
  <div>
    <div>
      <Text {...args}>Plain text</Text>
    </div>
    <div>
      <Text b {...args}>
        Bold text
      </Text>
    </div>
    <div>
      <Text u {...args}>
        Underline text
      </Text>
    </div>
    <div>
      <Text i {...args}>
        Italic text
      </Text>
    </div>
    <div>
      <Text color={'red'} {...args}>
        Colored text
      </Text>
    </div>
    <div>
      <Text em {...args}>
        Emphasis
      </Text>
    </div>
    <div>
      <Text strike {...args}>
        Strike
      </Text>
    </div>
    <div>
      <Text delete {...args}>
        Delete
      </Text>
    </div>
    <div>
      <Text code {...args}>
        Code
      </Text>
    </div>
    <div>
      <Text keyCode {...args}>
        Key Code
      </Text>
    </div>
  </div>
);

export const Basic = Template.bind({});
Basic.args = {
  children: 'Text',
};

export const All = TemplateAll.bind({});
All.args = {};
