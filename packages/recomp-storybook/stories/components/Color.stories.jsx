import React from 'react';

import { Color, useColorState } from '@recomp/color';
import '../stories.scss';

export default {
  title: 'Components/Color',
  component: Color,
  argTypes: {},
};

const Template = (args) => {
  const { props } = useColorState(args.value);
  return <Color {...args} {...props} />;
};

export const Basic = Template.bind({});
Basic.args = {
  value: '#ff0000',
};
