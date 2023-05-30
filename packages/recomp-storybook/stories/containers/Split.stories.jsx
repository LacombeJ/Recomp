import React from 'react';

import { Split, Stack } from '@recomp/core';
import '../stories.scss';

export default {
  title: 'Containers/Split',
  component: Split,
  argTypes: {},
};

const Template = (args) => <Split {...args} />;

export const Vertical = Template.bind({});
Vertical.args = {
  children: [
    <Split.Item key="1">
      <div className="split-left">Left</div>
    </Split.Item>,
    <Split.Item key="2">
      <div className="split-right">Right</div>
    </Split.Item>,
  ],
};

export const Horizontal = Template.bind({});
Horizontal.args = {
  split: 'horizontal',
  children: [
    <Split.Item key="1">
      <div className="split-top">Top</div>
    </Split.Item>,
    <Split.Item key="2">
      <div className="split-bottom">Bottom</div>
    </Split.Item>,
  ],
};

export const LeftSnap = Template.bind({});
LeftSnap.args = {
  children: [
    <Split.Item minSnap={250} key="1">
      <div className="split-left">Left</div>
    </Split.Item>,
    <Split.Item key="2">
      <div className="split-right">Right</div>
    </Split.Item>,
  ],
};

export const RightSnap = Template.bind({});
RightSnap.args = {
  children: [
    <Split.Item key="1">
      <div className="split-left">Left</div>
    </Split.Item>,
    <Split.Item minSnap={250} key="2">
      <div className="split-right">Right</div>
    </Split.Item>,
  ],
};

const QuadSplitTemplate = (args) => {
  const [horizontalSize, setHorizontalSize] = React.useState(null);
  const handleHorizontalResize = (e) => {
    setHorizontalSize(e.size);
  };

  return (
    <Split {...args}>
      <Split.Item>
        <Split
          size={horizontalSize}
          split="vertical"
          onResize={handleHorizontalResize}
        >
          <Split.Item minSize={'100px'}>
            <div className="top-left">Top Left</div>
          </Split.Item>
          <Split.Item minSize={'100px'}>
            <div className="top-right">Top Right</div>
          </Split.Item>
        </Split>
      </Split.Item>
      <Split.Item>
        <Split
          size={horizontalSize}
          split="vertical"
          onResize={handleHorizontalResize}
        >
          <Split.Item minSize={'100px'}>
            <div className="bottom-left">Bottom Left</div>
          </Split.Item>
          <Split.Item minSize={'100px'}>
            <div className="bottom-right">Bottom Right</div>
          </Split.Item>
        </Split>
      </Split.Item>
    </Split>
  );
};

export const QuadSplit = QuadSplitTemplate.bind({});
QuadSplit.args = {
  split: 'horizontal',
};
