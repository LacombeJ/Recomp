import React from 'react';

import { Checkbox, List } from '@recomp/core';
import '../stories.scss';

export default {
  title: 'Elements/List',
  component: List,
  argTypes: {},
};

const Template = (args) => <List {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  children: (
    <React.Fragment>
      <List.Item>Item 1</List.Item>
      <List.Item>Item 2</List.Item>
      <List.Item>Item 3</List.Item>
    </React.Fragment>
  ),
};

export const Nested = Template.bind({});
Nested.args = {
  nesting: 'both',
  children: (
    <React.Fragment>
      <List.Item>
        <div>Item 1</div>
        <List>
          <List.Item>
            <div>Item 1.1</div>
            <List>
              <List.Item>
                Item 1.1.1
                <List>
                  <List.Item>
                    Item 1.1.1.1
                    <List>
                      <List.Item>Item 1.1.1.1.1</List.Item>
                    </List>
                  </List.Item>
                </List>
              </List.Item>
              <List.Item>Item 1.1.2</List.Item>
              <List.Item>Item 1.1.3</List.Item>
            </List>
          </List.Item>
          <List.Item>Item 1.2</List.Item>
          <List.Item>Item 1.3</List.Item>
        </List>
      </List.Item>
      <List.Item>Item 2</List.Item>
      <List.Item>Item 3</List.Item>
    </React.Fragment>
  ),
};

export const CustomBullet = Template.bind({});
CustomBullet.args = {
  children: (
    <React.Fragment>
      <List.Item>Item 1</List.Item>
      <List.Item customBullet={<Checkbox></Checkbox>}>
        Item 2
      </List.Item>
      <List.Item customBullet={"-"}>Item 3</List.Item>
      <List.Item customBullet={"x"}>Item 4</List.Item>
      <List.Item customBullet={"o"}>Item 5</List.Item>
    </React.Fragment>
  ),
};
