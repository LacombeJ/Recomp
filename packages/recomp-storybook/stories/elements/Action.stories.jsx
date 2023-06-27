import React from 'react';

import { Action } from '@recomp/core';
import '../stories.scss';
import { IconTypography } from '@tabler/icons-react';

export default {
  title: 'Elements/Action',
  component: Action,
  argTypes: {},
};

const Template = (args) => <Action {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  children: <IconTypography stroke={1}></IconTypography>,
};
