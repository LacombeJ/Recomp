import * as React from 'react';

import * as util from '@recomp/utility/common';
import { Label } from './Label';
import { Input } from './Input';
import { Button } from './Button';

interface FormProps
  extends React.DetailedHTMLProps<
    React.FormHTMLAttributes<HTMLFormElement>,
    HTMLFormElement
  > {}

export const Form = (props: FormProps) => {
  props = util.structureUnion(defaultProps, props);
  const { dangerouslySetInnerHTML: _0, ...formProps } = props;
  return <form {...formProps} />;
};

const defaultProps: FormProps = {
  className: 'recomp-form',
};

// ----------------------------------------------------------------------------

Form.Row = (props: RowProps) => {
  props = util.structureUnion(rowDefaultProps, props);
  const { style } = props;

  const className = util.classnames({
    [props.className]: true,
    row: props.direction === 'row',
    column: props.direction === 'column',
  });

  return (
    <div className={className} style={style}>
      {props.children}
    </div>
  );
};

interface RowProps {
  className?: string;
  style?: React.CSSProperties;
  direction?: 'row' | 'column';
  children?: React.ReactNode;
}

const rowDefaultProps: RowProps = {
  className: 'recomp-form-row',
  direction: 'column',
};

// ----------------------------------------------------------------------------

interface FieldProps
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  classNames?: {
    label?: string;
    field?: string;
    disabled?: string;
  };
  id: string;
  embed?: boolean;
  button?: React.ReactNode;
  children?: React.ReactNode;
  onButtonClick?: () => any;
}

Form.Field = (props: FieldProps) => {
  props = util.structureUnion(fieldDefaultProps, props);

  const {
    classNames,
    id,
    embed,
    button,
    children,
    onButtonClick,
    ...inputProps
  } = props;

  if (embed) {
    return (
      <React.Fragment>
        <Label htmlFor={id} className={classNames.label}>
          {children}
          <span className={classNames.field}>
            <Input {...inputProps}></Input>
            {button ? (
              <Button disabled={props.disabled} onClick={props.onButtonClick}>
                {button}
              </Button>
            ) : null}
          </span>
        </Label>
      </React.Fragment>
    );
  } else {
    return (
      <React.Fragment>
        <Label htmlFor={id} className={classNames.label}>
          {children}
        </Label>
        <span className={classNames.field}>
          <Input {...inputProps}></Input>
          {button ? (
            <Button disabled={props.disabled} onClick={onButtonClick}>
              {button}
            </Button>
          ) : null}
        </span>
      </React.Fragment>
    );
  }
};

const fieldDefaultProps = {
  classNames: {
    label: 'label',
    field: 'field',
    disabled: 'diabled',
  },
  embed: false,
};
