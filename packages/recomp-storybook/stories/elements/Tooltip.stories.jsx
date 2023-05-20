import React from 'react';

import { Tooltip } from '@recomp/core';
import '../stories.styl';

export default {
  title: 'Elements/Tooltip',
  component: Tooltip,
  argTypes: {},
};

const Template = (args) => <Tooltip {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  children: 'Tooltip - For hover descriptions',
};
