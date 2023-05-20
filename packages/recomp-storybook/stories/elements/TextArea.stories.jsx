import React from 'react';

import { TextArea } from '@recomp/core';
import '../stories.styl';

export default {
  title: 'Elements/TextArea',
  component: TextArea,
  argTypes: {},
};

const Template = (args) => <TextArea {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  defaultValue: 'TextArea',
};
