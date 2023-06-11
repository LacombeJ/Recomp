import React from 'react';

import { Button } from '@recomp/core';
import { MonacoArea, MonacoEditor } from '@recomp/monaco';
import '../stories.scss';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/Monaco',
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

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const TemplateArea = (args) => <MonacoArea {...args} />;

export const Area = TemplateArea.bind({});
Area.args = {
  theme: 'vs-dark',
  value: 'const component = "Monaco Area";',
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const TemplateContext = (args) => {
  const [index, setIndex] = React.useState(0);
  const [text, setText] = React.useState({
    0: 'const component = "Monaco Area Context #0";',
    1: 'const component = "Monaco Area Context #1";',
  });

  const editorText = text[index];
  return (
    <div>
      <Button onClick={() => setIndex(0)}>State 0</Button>
      <Button onClick={() => setIndex(1)}>State 1</Button>
      <MonacoArea
        {...args}
        key={index}
        value={editorText}
        onChange={(updatedText) => {
          setText((state) => {
            return {
              ...state,
              [index]: updatedText,
            };
          });
        }}
      />
    </div>
  );
};

export const SwitchingContext = TemplateContext.bind({});
SwitchingContext.args = {
  theme: 'vs-dark',
};
