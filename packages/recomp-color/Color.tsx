import * as React from 'react';

import * as util from '@recomp/utility/common';
import * as color from '@recomp/utility/color';

import { Entry, Popover, usePopover } from '@recomp/core';

import { HexColorPicker } from 'react-colorful';

interface ColorProps {
  className?: string;
  style?: React.CSSProperties;
  value?: string;
  display?: 'inline' | 'block';
  onChange?: (value: string) => void;
}

export const Color = (props: ColorProps) => {
  props = util.structureUnion(defaultProps, props);

  const popover = usePopover();

  const handleOnEntryFocus = (focus: boolean) => {
    if (focus) {
      popover.setVisible(true);
    }
  };

  const setEntryRef = (element: HTMLElement) => {
    popover.setAnchorRef(element);
    popover.setFocusableRef(element);
  };

  const value = props.value ?? '#000000';

  const foregroundColor = color.foregroundFromBackground(
    color.convertTo(value, 'RGB')
  );
  const fg = color.convertTo(foregroundColor, 'RGB');
  const fga = foregroundColor === 'white' ? '0.3' : '0.6';
  const className = util.classnames({
    [props.className]: true,
    inline: props.display === 'inline',
  });

  const style: React.CSSProperties = {
    backgroundColor: value,
    color: foregroundColor,
    borderColor: `rgba(${fg.r}, ${fg.g}, ${fg.b}, ${fga})`,
  };

  return (
    <div className={className} style={props.style}>
      <Popover
        visible={popover.visible}
        position={popover.position}
        setContainerRef={popover.setContainerRef}
      >
        <div style={{ padding: '8px' }}>
          <HexColorPicker
            color={value}
            onChange={(c) => {
              props.onChange?.(c);
            }}
          ></HexColorPicker>
        </div>
      </Popover>
      <Entry style={style} onFocus={handleOnEntryFocus} setRef={setEntryRef}>
        {value}
      </Entry>
    </div>
  );
};

const defaultProps: ColorProps = {
  className: 'recomp-color',
  display: 'inline',
};

// ----------------------------------------------------------------------------

export const useColorState = (defaultValue?: string) => {
  const [value, setValue] = React.useState(defaultValue);

  const props: ColorProps = {
    value,
    onChange: (value) => {
      setValue(value);
    },
  };

  return {
    props,
  };
};
