import React from 'react';

import { Checkbox, useCheckboxState } from '@recomp/core';
import '../stories.scss';

export default {
  title: 'Elements/Checkbox',
  component: Checkbox,
  argTypes: {},
};

const Template = (args) => {
  const checkbox = useCheckboxState();
  return <Checkbox {...args} {...checkbox.props} />;
};

export const Basic = Template.bind({});
Basic.args = {
  children: 'Checkbox',
};
