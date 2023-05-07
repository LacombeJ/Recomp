import React from 'react';

import { SketchPad } from '@recomp/sketchpad';
import './stories.styl';

export default {
  title: 'Components/SketchPad',
  component: SketchPad,
  argTypes: {},
};

const Template = (args) => <SketchPad {...args} />;

export const Basic = Template.bind({});
Basic.args = {};
