import * as React from 'react';

import * as util from '@recomp/utility/common';
import { isElement } from '../utility/util';

interface StackProps {
  direction: Direction;
  children: React.ReactNode;
}

interface StackItemProps {
  className?: string;
  style?: React.CSSProperties;
  size: string | number;
  scroll?: Scroll;
  scrollPolicy?: ScrollPolicy;
  settings?: ChildSettings;
  children?: React.ReactNode;
}

type Direction = 'horizontal' | 'vertical';
type Scroll = 'x' | 'y' | 'xy';
type ScrollPolicy = 'scroll' | 'auto' | 'overlay' | 'none';

interface ChildSettings {
  anchor: string;
  offset: string;
  paddingTop: number;
  paddingBot: number;
  direction: Direction;
}

const Stack = (props: StackProps) => {
  return (
    <React.Fragment>
      {childrenWithSettings(props.children, props.direction)}
    </React.Fragment>
  );
};

Stack.Item = (props: StackItemProps) => {
  const isVertical = props.settings.direction === 'vertical';

  const classes = util.classnames({
    row: isVertical,
    col: !isVertical,
    [props.scrollPolicy]: props.scrollPolicy !== 'none',
    [props.scroll]: true,
  });

  const style = {
    ...stackStyle(props),
    ...util.defineStyle(classes, stackItemStyleDef),
  };

  return (
    <div className={props.className} style={style}>
      {props.children}
    </div>
  );
};

// ----------------------------------------------------------------------------

const stackItemStyleDef = {
  overflow: 'hidden',
  position: 'absolute',

  '.row': {
    left: '0px',
    right: '0px',
  },
  '.col': {
    top: '0px',
    bottom: '0px',
  },

  // auto overflow
  '.auto.x': {
    overflowX: 'auto',
  },
  '.auto.y': {
    overflowY: 'auto',
  },
  '.auto.xy': {
    overflow: 'auto',
  },

  // scroll overflow
  '.scroll.x': {
    overflowX: 'scroll',
  },
  '.scroll.y': {
    overflowY: 'scroll',
  },
  '.scroll.xy': {
    overflow: 'scroll',
  },

  // overlay overflow
  '.overlay.x': {
    overflowX: 'overlay',
  },
  '.overlay.y': {
    overflowY: 'overlay',
  },
  '.overlay.xy': {
    overflow: 'overlay',
  },
};

const stackStyle = (props: StackItemProps) => {
  const style: { [key: string]: any } = {};

  const label = util.boundaryLabel(props.settings.direction);

  if (props.settings.anchor === 'top') {
    style[label.front] = props.settings.offset + 'px';
    style[label.size] = props.size + 'px';
  } else if (props.settings.anchor === 'bot') {
    style[label.back] = props.settings.offset + 'px';
    style[label.size] = props.size + 'px';
  } else {
    style[label.front] = props.settings.paddingTop + 'px';
    style[label.back] = props.settings.paddingBot + 'px';
  }

  return style;
};

const childrenWithSettings = (
  children: React.ReactNode,
  direction: Direction
) => {
  const childrenArray = React.Children.toArray(children).filter((child) => {
    return isElement(child) && child.type === Stack.Item;
  });

  const childrenSettings = React.Children.map(childrenArray, (_) => {
    return {
      anchor: 'top',
      offset: '0',
      paddingTop: 0,
      paddingBot: 0,
      direction,
    };
  });

  let centerIndex = -1;
  let top = 0;
  let bot = 0;
  let topIndex = 0;
  let botIndex = 0;

  // Set top anchor
  for (topIndex = 0; topIndex < childrenArray.length; ++topIndex) {
    const childItem = childrenArray[topIndex] as React.ReactElement;
    let size = childItem.props.size;

    if (size === 'x') {
      centerIndex = topIndex;
      break;
    } else {
      childrenSettings[topIndex].anchor = 'top';
      childrenSettings[topIndex].offset = top.toString();
      top += parseInt(size);
    }
  }

  // Set bot anchor
  for (botIndex = childrenArray.length - 1; botIndex > topIndex; --botIndex) {
    const childItem = childrenArray[botIndex] as React.ReactElement;
    let size = childItem.props.size;

    if (size === 'x') {
      break;
    } else {
      childrenSettings[botIndex].anchor = 'bot';
      childrenSettings[botIndex].offset = bot.toString();
      bot += parseInt(size);
    }
  }

  // Set center anchor
  if (centerIndex !== -1) {
    childrenSettings[centerIndex].anchor = 'none';
    childrenSettings[centerIndex].offset = '0';
    childrenSettings[centerIndex].paddingTop = top;
    childrenSettings[centerIndex].paddingBot = bot;
  }

  return React.Children.map(childrenArray, (child, i) => {
    if (isElement(child)) {
      return React.cloneElement(child, {
        settings: childrenSettings[i],
      });
    }
  });
};

export default Stack;
