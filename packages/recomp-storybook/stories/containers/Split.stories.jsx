import React from 'react';

import { Split, Stack } from '@recomp/core';
import '../stories.scss';

export default {
  title: 'Containers/Split',
  component: Split,
  argTypes: {},
};

const Template = (args) => <Split {...args} />;

export const Horizontal = Template.bind({});
Horizontal.args = {
  split: 'horizontal',
  children: [
    <Split.Item key="1">
      <div className="split-left">Left</div>
    </Split.Item>,
    <Split.Item key="2">
      <div className="split-right">Right</div>
    </Split.Item>,
  ],
};

export const Vertical = Template.bind({});
Vertical.args = {
  split: 'vertical',
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

const OrientedTemplate = (args) => {
  const [horizontalSize, setHorizontalSize] = React.useState(null);
  const handleHorizontalResize = (size) => {
    setHorizontalSize(size);
  };

  return (
    <React.Fragment>
      <div style={{ fontSize: '32px' }}>Size: {horizontalSize}</div>
      <Split size={horizontalSize} {...args} onResize={handleHorizontalResize}>
        <Split.Item>
          <div className="split-left">Left</div>
        </Split.Item>
        <Split.Item>
          <div className="split-right">Right</div>
        </Split.Item>
      </Split>
    </React.Fragment>
  );
};

export const Oriented = OrientedTemplate.bind({});
Oriented.args = {
  orientation: 'second',
};

const PropsSizeTemplate = (args) => {
  const [size, setHorizontalSize] = React.useState('200px');
  const handleHorizontalResize = (size) => {
    setHorizontalSize(size);
  };

  return (
    <React.Fragment>
      <div style={{ fontSize: '32px' }}>Size: {size}</div>
      <Split size={size} {...args} onResize={handleHorizontalResize}>
        <Split.Item minSize={'150px'}>
          <div className="split-left">Left</div>
        </Split.Item>
        <Split.Item minSnap={'150px'} maxSize={'400px'} defaultSize={'200px'}>
          <div className="split-right">Right</div>
        </Split.Item>
      </Split>
    </React.Fragment>
  );
};

export const PropsSize = PropsSizeTemplate.bind({});
PropsSize.args = {
  split: 'horizontal',
  orientation: 'second',
};

const QuadSplitTemplate = (args) => {
  const [splitSize, setSplitSize] = React.useState(null);
  const handleSplitResize = (size) => {
    setSplitSize(size);
  };

  return (
    <Split {...args}>
      <Split.Item>
        <Split size={splitSize} split="vertical" onResize={handleSplitResize}>
          <Split.Item minSize={'100px'}>
            <div className="top-left">Top Left</div>
          </Split.Item>
          <Split.Item minSize={'100px'}>
            <div className="bottom-left">Bottom Left</div>
          </Split.Item>
        </Split>
      </Split.Item>
      <Split.Item>
        <Split size={splitSize} split="vertical" onResize={handleSplitResize}>
          <Split.Item minSize={'100px'}>
            <div className="top-right">Top Right</div>
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
