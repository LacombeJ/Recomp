import React from 'react';

import { Katex } from '@recomp/katex';
import './stories.styl';

export default {
  title: 'Components/Katex',
  component: Katex,
  argTypes: {},
};

const Template = (args) => <Katex {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  size: 'large',
  children: '\\KaTeX f(x) = \\int 3x + 2',
};
