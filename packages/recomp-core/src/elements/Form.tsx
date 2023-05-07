import * as React from 'react';

import * as util from '@recomp/utility/common';

interface FormProps
  extends React.DetailedHTMLProps<
    React.FormHTMLAttributes<HTMLFormElement>,
    HTMLFormElement
  > {}

const Form = (props: FormProps) => {
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

export default Form;
