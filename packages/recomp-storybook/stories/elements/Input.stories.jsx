import React from 'react';

import { Input } from '@recomp/core';
import '../stories.scss';

export default {
  title: 'Elements/Input',
  component: Input,
  argTypes: {},
};

const Template = (args) => <Input {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  defaultValue: 'Input',
};

const TemplateTypes = (args) => (
  <div>
    <div>
      <Input {...args} type="date" />
    </div>
    <div>
      <Input {...args} type="month" />
    </div>
    <div>
      <Input {...args} type="week" />
    </div>
    <div>
      <Input {...args} type="time" />
    </div>
    <div>
      <Input {...args} type="color" />
    </div>
    <div>
      <Input {...args} type="number" />
    </div>
    <div>
      <Input {...args} type="range" />
    </div>
    <div>
      <Input {...args} type="tel" />
    </div>
    <div>
      <Input {...args} type="email" />
    </div>
    <div>
      <Input {...args} type="password" />
    </div>
  </div>
);

export const Types = TemplateTypes.bind({});
Types.args = {};
