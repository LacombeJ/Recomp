import React from 'react';

import { Alert } from '@recomp/core';
import '../stories.scss';

export default {
  title: 'Elements/Alert',
  component: Alert,
  argTypes: {},
};

const Template = (args) => <Alert {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  title: 'Alert!',
  children: 'Attention, this is an alert notification.',
};
