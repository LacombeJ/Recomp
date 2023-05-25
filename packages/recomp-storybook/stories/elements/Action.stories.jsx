import React from 'react';

import { Action } from '@recomp/core';
import '../stories.scss';
import { IconBarbell } from '@tabler/icons-react';

export default {
  title: 'Elements/Action',
  component: Action,
  argTypes: {},
};

const Template = (args) => <Action {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  children: <IconBarbell></IconBarbell>,
};
