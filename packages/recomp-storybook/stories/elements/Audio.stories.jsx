import React from 'react';

import { Audio } from '@recomp/core';
import '../stories.scss';

export default {
  title: 'Elements/Audio',
  component: Audio,
  argTypes: {},
};

const Template = (args) => <Audio {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  children: 'Audio',
};
