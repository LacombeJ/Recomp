import React from 'react';

import { Radio } from '@recomp/core';
import '../stories.scss';

export default {
  title: 'Elements/Radio',
  component: Radio.Group,
  argTypes: {},
};

const Template = (args) => <Radio {...args} />;
const TemplateGroup = (args) => <Radio.Group {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  children: 'Radio',
};

export const Group = TemplateGroup.bind({});
Group.args = {
  children: [
    <Radio key="1" id="1">Choice 1</Radio>,
    <Radio key="2" id="2">Choice 2</Radio>,
    <Radio key="3" id="3">Choice 3</Radio>,
  ],
};
