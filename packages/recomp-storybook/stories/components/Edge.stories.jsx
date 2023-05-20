import React from 'react';

import { Edge } from '@recomp/edge';
import '../stories.styl';

export default {
  title: 'Components/Edge',
  component: Edge,
  argTypes: {},
};

const Template = (args) => <Edge {...args} />;

const tabs = [
  {
    group: 'Components',
    color: '#CA5D49',
    items: ['Button.tsx', 'List.tsx', 'Navbar.tsx'],
  },
  {
    group: 'Styles',
    color: '#31AC9F',
    items: ['button.styl', 'list.styl', 'navbar.styl'],
  },
  'index.ts',
  'index.html',
  'package.json',
  'tsconfig.json',
  'README.md',
];

const mapItems = (items) => {
  return items.map((item) => {
    if (typeof item === 'string') {
      return (
        <Edge.Tab id={item} key={item}>
          {item}
        </Edge.Tab>
      );
    } else {
      const { group, color, items } = item;
      return (
        <Edge.Group id={group} key={group} color={color}>
          {mapItems(items)}
        </Edge.Group>
      );
    }
  });
};

export const Basic = Template.bind({});
Basic.args = {
  children: mapItems(tabs),
};
