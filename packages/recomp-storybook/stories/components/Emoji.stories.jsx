import React from 'react';

import { Emoji } from '@recomp/emoji';
import '../stories.scss';

export default {
  title: 'Components/Emoji',
  component: Emoji,
  argTypes: {},
};

const Template = (args) => <Emoji {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  animated: true,
  children: '🤩',
};
