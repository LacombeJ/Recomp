import React from 'react';

import { Alert } from '@recomp/core';
import '../stories.scss';
import {
  IconAlertTriangle,
  IconCircleCheck,
  IconCircleX,
} from '@tabler/icons-react';

export default {
  title: 'Elements/Alert',
  component: Alert,
  argTypes: {},
};

const Template = (args) => <Alert {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  title: 'Alert!',
  icon: <IconAlertTriangle size={28}></IconAlertTriangle>,
  children: 'Attention, this is an alert notification.',
  closeable: true,
};

const TemplateVariants = (args) => (
  <div>
    <Alert
      {...args}
      title="Alert Default"
      children="Default variant non-closeable alert with no icon"
    />
    <Alert
      {...args}
      title="Alert Primary"
      children="Primary variant non-closeable alert with no icon"
      variant="primary"
    />
    <Alert
      {...args}
      title="Alert Success"
      children="Success variant alert"
      icon={<IconCircleCheck size={28}></IconCircleCheck>}
      variant="success"
      closeable
    />
    <Alert
      {...args}
      title="Alert Warn"
      children="Warn variant alert"
      icon={<IconAlertTriangle size={28}></IconAlertTriangle>}
      variant="warn"
      closeable
    />
    <Alert
      {...args}
      title="Alert Danger"
      children="Danger variant alert"
      icon={<IconCircleX size={28}></IconCircleX>}
      variant="danger"
      closeable
    />
  </div>
);

export const Variants = TemplateVariants.bind({});
Variants.args = {
  style: { margin: '16px' },
};
