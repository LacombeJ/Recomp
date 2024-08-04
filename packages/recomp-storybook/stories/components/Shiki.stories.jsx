import React from 'react';

import { Shiki } from '@recomp/shiki';
import '../stories.scss';

export default {
  title: 'Components/Shiki',
  component: Shiki,
  argTypes: {},
};

const Template = (args) => <Shiki {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  children: 'const component = "Shiki";\n\n// Shiki code component\n',
};

const TemplateDisplay = (args) => (
  <div>
    <div>
      <Shiki {...args} inline={false}>
        {'// Block display for multi-line code\nconst display = "Block";'}
      </Shiki>
    </div>
    <div>
      <Shiki {...args} inline={true}>
        {'const display = "inline"; // inline for single line span'}
      </Shiki>
    </div>
    <div>
      <Shiki {...args} inline={true}>
        {'const display = "inline"; // inline for single line span'}
      </Shiki>
    </div>
    <div>
      <Shiki {...args} inline={true}>
        {'const display = "inline"; // inline for single line span'}
      </Shiki>
    </div>
  </div>
);

export const Display = TemplateDisplay.bind({});
Display.args = {};
