import React from 'react';

import { Cabinet, useCabinetState } from '@recomp/core';
import '../stories.scss';

export default {
  title: 'Elements/Cabinet',
  component: Cabinet,
  argTypes: {},
};

const Template = (args) => {
  const cabinet = useCabinetState();
  return <Cabinet {...args} {...cabinet.props} />;
};

export const Basic = Template.bind({});
Basic.args = {
  title: 'Cabinet',
  subtitle: 'A widget container with ability to expand/collapse visibility',
  children: (
    <div>
      <h3>Inside the cabinet</h3>
      Cabinets are useful in scenarios such as:
      <ul>
        <li>Shortening length of document</li>
        <li>Hiding spoilers</li>
        <li>Organizing content</li>
      </ul>
    </div>
  ),
};
