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
