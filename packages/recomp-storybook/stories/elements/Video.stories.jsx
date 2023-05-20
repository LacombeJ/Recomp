import React from 'react';

import { Video } from '@recomp/core';
import '../stories.scss';

export default {
  title: 'Elements/Video',
  component: Video,
  argTypes: {},
};

const Template = (args) => <Video {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  src: 'https://www.youtube.com/embed/GXI0l3yqBrA',
};
