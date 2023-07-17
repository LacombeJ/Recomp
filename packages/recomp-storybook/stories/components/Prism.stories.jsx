import React from 'react';

import { Prism } from '@recomp/prism';
import '../stories.scss';

export default {
  title: 'Components/Prism',
  component: Prism,
  argTypes: {},
};

const Template = (args) => <Prism {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  children: 'const component = "Prism";\n\n// Prism code component\n',
};

const TemplateDisplay = (args) => (
  <div>
    <div>
      <Prism {...args} inline={false}>
        {'// Block display for multi-line code\nconst display = "Block";'}
      </Prism>
    </div>
    <div>
      <Prism {...args} inline={true}>
        {'const display = "inline"; // inline for single line span'}
      </Prism>
    </div>
    <div>
      <Prism {...args} inline={true}>
        {'const display = "inline"; // inline for single line span'}
      </Prism>
    </div>
    <div>
      <Prism {...args} inline={true}>
        {'const display = "inline"; // inline for single line span'}
      </Prism>
    </div>
  </div>
);

export const Display = TemplateDisplay.bind({});
Display.args = {};
