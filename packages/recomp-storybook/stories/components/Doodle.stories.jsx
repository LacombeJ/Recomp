import React from 'react';

import { Doodle } from '@recomp/doodle';
import '../stories.scss';

export default {
  title: 'Components/Doodle',
  component: Doodle,
  argTypes: {},
};

const Template = (args) => <Doodle {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  children: `@grid: 7 / 100vmax / #0a0c27;
  @shape: clover 5;
  background: hsla(-@i(*4), 70%, 68%, @r.8);
  transform:
    scale(@r(.2, 1.5))
    translate(@m2.@r(±50%));
  `,
};
