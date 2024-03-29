import React from 'react';

import { Katex } from '@recomp/katex';
import '../stories.scss';

export default {
  title: 'Components/Katex',
  component: Katex,
  argTypes: {},
};

const Template = (args) => <Katex {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  size: 'large',
  children: '\\KaTeX\nf(x) = x + 1',
};
