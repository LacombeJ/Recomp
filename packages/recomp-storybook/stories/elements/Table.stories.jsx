import React from 'react';

import { Table, Button, Checkbox, List } from '@recomp/core';
import '../stories.scss';

export default {
  title: 'Elements/Table',
  component: Table,
  argTypes: {},
};

const Template = (args) => <Table {...args} />;

const tableData = {
  headers: ['Content', 'Value', 'Description', <Checkbox />],
  rows: [
    ['First row', 'String', 'Description text', <Checkbox />],
    [
      'Nothing',
      null,
      <div>
        This description spans multiple lines and has bullets:
        <List>
          <List.Item>Item 1</List.Item>
          <List.Item>Item 2</List.Item>
        </List>
      </div>,
      <Checkbox />,
    ],
    [<Button>3rd Row</Button>, 'Button', '', <Checkbox />],
  ],
};

export const Basic = Template.bind({});
Basic.args = {
  data: tableData,
};
