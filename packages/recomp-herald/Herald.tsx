import * as React from 'react';

import { propUnion } from '@recomp/props';

import { useImmer, useTimeout } from '@recomp/hooks';
import { useAnimationLifecycle } from '@recomp/animate/useAnimationLifecycle';

// ----------------------------------------------------------------------------

export interface HeraldNotification {
  id: string;
  duration?: number;
  trigger?: 'none' | 'close';
}

export interface HeraldModel {
  notifications: HeraldNotification[];
}

const notificationDefaults = {
  duration: 5000,
};

// ----------------------------------------------------------------------------

export interface HeraldProps {
  className?: string;
  classNames?: {
    notification?: string;
  };
  style?: React.CSSProperties;
  defaultDuration?: number;
  model: HeraldModel;
  render?: (notification: HeraldNotification) => React.ReactNode;
  onRemoveNotification?: (id: string) => any;
}

export const Herald = (props: HeraldProps) => {
  props = propUnion(defaultProps, props);

  return (
    <div className={props.className} style={props.style}>
      {props.model.notifications.map((notification) => {
        notification = { ...notificationDefaults, ...notification };
        return (
          <Notification
            className={props.classNames.notification}
            key={notification.id}
            id={notification.id}
            duration={notification.duration}
            trigger={notification.trigger}
            onRemoveNotification={props.onRemoveNotification}
          >
            {props.render(notification)}
          </Notification>
        );
      })}
    </div>
  );
};

const defaultProps = {
  className: 'recomp-herald',
  classNames: {
    notification: 'notification',
  },
  render: (notification: HeraldNotification) => notification.id,
};

// ----------------------------------------------------------------------------

interface NotificationProps {
  className: string;
  id: string;
  duration: number;
  trigger: 'none' | 'close';
  children: React.ReactNode;
  onRemoveNotification?: (id: string) => any;
}

export const Notification = (props: NotificationProps) => {
  const duration = useTimeout(props.duration);

  React.useEffect(() => {
    if (props.trigger === 'close') {
      setAnimationState('close');
    }
  }, [props.trigger]);

  const [{ x, opacity }, setAnimationState] = useAnimationLifecycle(
    {
      mount: { x: 200, opacity: 0 },
      default: { x: 0, opacity: 1 },
      close: { x: 200, opacity: 0 },
    },
    {
      default: [
        {
          to: 'close',
          duration: 300,
          onComplete: () => {
            props.onRemoveNotification?.(props.id);
          },
        },
      ],
    }
  );

  const position: React.CSSProperties = {
    left: `${x}px`,
    opacity: `${opacity}`,
  };

  const style: React.CSSProperties = {
    ...position,
  };

  React.useEffect(() => {
    duration.begin(() => {
      setAnimationState('close');
    });

    return () => {
      duration.cancel();
    };
  }, []);

  return (
    <div className={props.className} style={style}>
      {props.children}
    </div>
  );
};

// ----------------------------------------------------------------------------

/** Herald state management hook */
export const useHeraldState = (
  defaultModel: HeraldModel = { notifications: [] }
) => {
  const [model, setModel] = useImmer(defaultModel);

  const pushNotification = (notification: HeraldNotification) => {
    setModel((model) => {
      if (!model.notifications.find((item) => item.id === notification.id)) {
        model.notifications.push(notification);
      }
    });
  };

  const closeNotification = (id: string) => {
    setModel((model) => {
      for (const notification of model.notifications) {
        if (notification.id === id) {
          notification.trigger = 'close';
        }
      }
    });
  };

  const removeNotification = (id: string) => {
    setModel((model) => {
      model.notifications = model.notifications.filter(
        (notification) => notification.id !== id
      );
    });
  };

  /** Props to pass to herald component */
  const heraldProps = {
    onRemoveNotification: removeNotification,
  };

  return { model, pushNotification, closeNotification, heraldProps };
};
