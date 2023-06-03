import React from 'react';

import { Entry, Input } from '@recomp/core';
import '../stories.scss';

export default {
  title: 'Elements/Entry',
  component: Entry,
  argTypes: {},
};

const Template = (args) => <Entry {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  children: <div>Entry</div>,
};
