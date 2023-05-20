import React from 'react';

import { Table } from '@recomp/core';
import '../stories.scss';

export default {
  title: 'Elements/Table',
  component: Table,
  argTypes: {},
};

const Template = (args) => <Table {...args} />;

const tableData = {
  headers: ['Content', 'Value', 'Description', <input type="checkbox"></input>],
  rows: [
    [
      'First row',
      'String',
      'Description text',
      <input type="checkbox"></input>,
    ],
    [
      'Nothing',
      null,
      <div>
        This description spans multiple lines and has bullets:
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
        </ul>
      </div>,
      <input type="checkbox"></input>,
    ],
    [<button>3rd Row</button>, 'Button', '', <input type="checkbox"></input>],
  ],
};

export const Basic = Template.bind({});
Basic.args = {
  data: tableData,
};
