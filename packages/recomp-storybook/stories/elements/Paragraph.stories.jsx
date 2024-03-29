import React from 'react';

import { Paragraph } from '@recomp/core';
import '../stories.scss';

export default {
  title: 'Elements/Paragraph',
  component: Paragraph,
  argTypes: {},
};

const Template = (args) => <Paragraph {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  children: (
    <React.Fragment>Paragraph. This is a paragraph element.</React.Fragment>
  ),
};
