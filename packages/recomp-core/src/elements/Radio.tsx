import * as React from 'react';

import * as util from '@recomp/utility/common';
import NestBreak from '../fragments/NestBreak';
import useNestedProps from '@recomp/hooks/useNestedProps';

interface RadioProps {
  className?: string;
  classNames?: {
    mark?: string;
    label?: string;
  };
  style?: React.CSSProperties;
  id?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  block?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  children?: React.ReactNode;
}

const Radio = (props: RadioProps) => {
  props = util.structureUnion(defaultProps, props);

  const { className, classNames, style } = props;

  const [checked, setChecked] = React.useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(e.target.checked);
    props.onChange(e);
  };

  const actualCheck = props.checked !== undefined ? props.checked : checked;

  return (
    <label className={className} style={style}>
      <input type="radio" checked={actualCheck} onChange={handleChange}></input>
      <span className={classNames.mark}></span>
      <span className={classNames.label}>{props.children}</span>
    </label>
  );
};
Radio.identifier = 'recomp-radio';

const defaultProps: RadioProps = {
  className: 'recomp-radio',
  classNames: {
    mark: 'mark',
    label: 'label',
  },
  defaultChecked: false,
  block: false,
  onChange: () => {},
};

// ----------------------------------------------------------------------------

interface GroupProps {
  className?: string;
  style?: React.CSSProperties;
  defaultChecked?: string;
  onChecked?: (id: string) => any;
  children?: React.ReactNode;
}

const Group = (props: GroupProps) => {
  props = util.structureUnion(groupDefaultProps, props);

  const { className, style } = props;

  const [checked, setChecked] = React.useState(props.defaultChecked);

  const [nest] = useNestedProps(
    (child: any) => {
      if (
        child &&
        child.type &&
        child.type.identifier === NestBreak.identifier
      ) {
        return { break: true };
      }

      if (child && child.type && child.type.identifier === Radio.identifier) {
        const { id } = child.props;
        return {
          props: {
            checked: checked === id,
            onChange: (e: any) => {
              if (child.props.onChange) {
                child.props.onChange(e);
              }
              setChecked(id);
              props.onChecked(id);
            },
          },
        };
      }
    },
    [checked]
  );

  return (
    <div className={className} style={style}>
      {nest(props.children)}
    </div>
  );
};
Group.identifier = 'recomp-radiogroup';

const groupDefaultProps: GroupProps = {
  className: 'recomp-radiogroup',
  onChecked: () => {},
};

Radio.Group = Group;

export default Radio;