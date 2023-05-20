import React from 'react';

import { Heading } from '@recomp/core';
import '../stories.scss';

export default {
  title: 'Elements/Heading',
  component: Heading,
  argTypes: {},
};

const Template = (args) => <Heading {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  children: 'Heading',
};

const TemplateAll = (args) => (
  <div>
    <Heading {...args} level={1}>
      Heading 1
    </Heading>

    <Heading {...args} level={2}>
      Heading 2
    </Heading>

    <Heading {...args} level={3}>
      Heading 3
    </Heading>

    <Heading {...args} level={4}>
      Heading 4
    </Heading>

    <Heading {...args} level={5}>
      Heading 5
    </Heading>

    <Heading {...args} level={6}>
      Heading 6
    </Heading>
  </div>
);

export const All = TemplateAll.bind({});
All.args = {};
