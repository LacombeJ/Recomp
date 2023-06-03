import * as React from 'react';

import * as util from '@recomp/utility/common';

interface DialogProps
  extends React.DetailedHTMLProps<
    React.DialogHTMLAttributes<HTMLDialogElement>,
    HTMLDialogElement
  > {
  classNames?: {
    tint?: 'tint';
    blur?: 'blur';
  };
  tint?: boolean;
  blur?: boolean;
  onClickBackdrop?: () => any;
  setDialogRef?: (element: HTMLDialogElement) => any;
}

export const Dialog = (props: DialogProps) => {
  props = util.propUnion(defaultProps, props);

  const dialogRef = React.useRef<HTMLDialogElement>();

  const {
    classNames,
    setDialogRef,
    onClickBackdrop,
    className: _0,
    dangerouslySetInnerHTML: _1,
    ...dialogProps
  } = props;

  const className = util.classnames({
    [props.className]: true,
    [props.classNames.tint]: props.tint,
    [props.classNames.blur]: props.blur,
  });

  const handleSetRef = (element: HTMLDialogElement) => {
    setDialogRef?.(element);
    dialogRef.current = element;
  };

  const handleClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    props.onClick?.(e);
    if (dialogRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickedInDialog =
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width;
      if (!clickedInDialog) {
        onClickBackdrop?.();
      }
    }
  };

  return (
    <dialog
      className={className}
      ref={handleSetRef}
      onClick={handleClick}
      {...dialogProps}
    >
      {props.children}
    </dialog>
  );
};

const defaultProps: DialogProps = {
  className: 'recomp-dialog',
  classNames: {
    tint: 'tint',
    blur: 'blur',
  },
};

// ----------------------------------------------------------------------------

export const useDialog = () => {
  const dialogRef = React.useRef<HTMLDialogElement>();

  const open = () => {
    if (dialogRef.current) {
      dialogRef.current.showModal();
    }
  };

  const close = () => {
    if (dialogRef.current) {
      dialogRef.current.close();
    }
  };

  const display = (show: boolean) => {
    if (show) {
      open();
    } else {
      close();
    }
  };

  const setDialogRef = (element: HTMLDialogElement) => {
    dialogRef.current = element;
  };

  return { setDialogRef, open, close, display };
};
