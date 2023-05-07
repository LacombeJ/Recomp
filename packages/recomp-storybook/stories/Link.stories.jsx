import React from 'react';

import { Link } from '@recomp/core';
import './stories.styl';

export default {
  title: 'Elements/Link',
  component: Link,
  argTypes: {},
};

const Template = (args) => <Link {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  children: 'Link',
};
