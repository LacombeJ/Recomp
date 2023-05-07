import React from 'react';

import { Image } from '@recomp/core';
import './stories.styl';

export default {
  title: 'Elements/Image',
  component: Image,
  argTypes: {},
};

const Template = (args) => <Image {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  src: 'https://media.giphy.com/media/w7CP59oLYw6PK/giphy.gif',
};
