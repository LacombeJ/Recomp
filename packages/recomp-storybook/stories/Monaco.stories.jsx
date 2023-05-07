import React from 'react';

import { MonacoEditor } from '@recomp/monaco';
import './stories.styl';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Example/Monaco',
  component: MonacoEditor,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args) => <MonacoEditor {...args} />;

export const Dark = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Dark.args = {
  theme: 'vs-dark',
  value: 'const component = "Monaco";',
};

export const Light = Template.bind({});
Light.args = {
  theme: 'light',
  value: 'const component = "Monaco";',
};

// export const Large = Template.bind({});
// Large.args = {
//   size: 'large',
//   label: 'Button',
// };

// export const Small = Template.bind({});
// Small.args = {
//   size: 'small',
//   label: 'Button',
// };
