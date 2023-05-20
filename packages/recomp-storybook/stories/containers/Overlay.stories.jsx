import React from 'react';

import { Overlay } from '@recomp/core';
import '../stories.scss';

export default {
  title: 'Containers/Overlay',
  component: Overlay,
  argTypes: {},
};

const Template = (args) => (
  <div>
    <Overlay {...args} />
    <div>This is some text under the overlay</div>
    <div>This is some text under the overlay</div>
    <div>This is some text under the overlay</div>
    <div>This is some text under the overlay</div>
    <div>This is some text under the overlay</div>
    <div>This is some text under the overlay</div>
    <div>This is some text under the overlay</div>
    <div>This is some text under the overlay</div>
    <div>This is some text under the overlay</div>
  </div>
);

export const Basic = Template.bind({});
Basic.args = {
  enabled: true,
  tint: true,
  blur: true,
  children: (
    <div
      style={{
        width: '200px',
        height: '200px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <h1>Overlay</h1>
    </div>
  ),
};
