import React from 'react';

import { Alert, Button } from '@recomp/core';
import { Herald, useHeraldState } from '@recomp/herald';
import '../stories.scss';

import {
  IconCircleCheck,
  IconCircleCheckFilled,
  IconCircleXFilled,
} from '@tabler/icons-react';

export default {
  title: 'Components/Herald',
  component: Herald,
  argTypes: {},
};

const notifications = {
  'notify:document:created': {
    title: 'Successfully created document',
    icon: <IconCircleCheckFilled></IconCircleCheckFilled>,
    message: 'Document created and uploaded to the server.',
    variant: 'success',
    closeable: true,
  },
  'notify:document:error': {
    title: 'Error creating new document',
    icon: <IconCircleXFilled></IconCircleXFilled>,
    message: 'Server is offline. Failed to create and upload new document.',
    variant: 'danger',
    closeable: true,
  },
  'notify:document:message': {
    title: 'Workspace opened',
    message: 'Document workspace opened',
    variant: 'primary',
    closeable: true,
  },
  'notify:document:loading': {
    title: 'Opening Document',
    message: 'Document Loading...',
    variant: 'default',
    closeable: true,
  },
};

const Template = (args) => {
  const { model, pushNotification, closeNotification, heraldProps } =
    useHeraldState();

  const handleRender = (item) => {
    const notification = notifications[item.id];
    return (
      <Alert
        icon={notification.icon}
        title={notification.title}
        variant={notification.variant}
        closeable={notification.closeable}
        style={{ margin: '8px' }}
        onClose={() => closeNotification(item.id)}
      >
        {notification.message}
      </Alert>
    );
  };

  return (
    <div>
      <div style={{ margin: '8px' }}>
        <Button
          onClick={() => pushNotification({ id: 'notify:document:message' })}
        >
          Push Message
        </Button>
      </div>
      <div style={{ margin: '8px' }}>
        <Button
          variant="primary"
          onClick={() => pushNotification({ id: 'notify:document:created' })}
        >
          Push Success
        </Button>
      </div>
      <div style={{ margin: '8px' }}>
        <Button
          variant="warn"
          onClick={() => pushNotification({ id: 'notify:document:error' })}
        >
          Push Error
        </Button>
      </div>
      <div style={{ margin: '8px' }}>
        <Button
          onClick={() => pushNotification({ id: 'notify:document:loading' })}
        >
          Push Uncloseable
        </Button>
      </div>
      <Herald {...args} model={model} render={handleRender} {...heraldProps} />
    </div>
  );
};

export const Basic = Template.bind({});
Basic.args = {
  children: `Herald`,
};
