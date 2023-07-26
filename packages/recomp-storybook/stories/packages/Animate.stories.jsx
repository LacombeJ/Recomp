import React from 'react';

import { Button, Alert } from '@recomp/core';
import '../stories.scss';
import { useAnimationLifecycle, useAnimationValue } from '@recomp/animate';

export default {
  title: 'Packages/Animate',
  argTypes: {},
};

const AnimationLifecycleExample = (props) => {
  const [{ left, opacity }, setAnimationState] = useAnimationLifecycle({
    mount: { left: 0, opacity: 0 },
    open: { left: 100, opacity: 1 },
    close: { left: 0, opacity: 0 },
  });

  React.useEffect(() => {
    if (props.visible) {
      setAnimationState('open');
    } else {
      setAnimationState('close');
    }
  }, [props.visible]);

  const style = {
    position: 'absolute',
    left: `${left}px`,
    opacity: `${opacity}`,
  };

  return (
    <div style={style}>
      <Alert title="Animation">{props.children}</Alert>
    </div>
  );
};

const TemplateLifecycle = (args) => {
  const [visible, setVisible] = React.useState(false);

  return (
    <div>
      <Button onClick={() => setVisible(!visible)}>Toggle Notification</Button>
      <AnimationLifecycleExample visible={visible} {...args} />
    </div>
  );
};

export const Lifecycle = TemplateLifecycle.bind({});
Lifecycle.args = {
  children: `useAnimationLifecycle`,
};

const TemplateValue = (args) => {
  const value = useAnimationValue(0, 255, 3000, true);

  return (
    <div {...args} style={{ color: `rgb(${Math.floor(value)}, 0, 255)` }}></div>
  );
};

export const Value = TemplateValue.bind({});
Value.args = {
  children: `useAnimationValue`,
};
