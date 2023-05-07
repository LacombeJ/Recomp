import React from 'react';

import { Canvas } from '@recomp/core';
import './stories.styl';

export default {
  title: 'Elements/Canvas',
  component: Canvas,
  argTypes: {},
};

const Template = (args) => <Canvas {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  render(ctx) {
    ctx.fillStyle = '#E0E0E0';
    ctx.fillRect(0, 0, 300, 150);

    ctx.fillStyle = '#177e82';
    ctx.fillRect(20, 20, 150, 100);
  },
};
