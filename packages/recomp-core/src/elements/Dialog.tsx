import * as React from 'react';

import * as util from '@recomp/utility/common';

interface DialogProps
  extends React.DetailedHTMLProps<
    React.DialogHTMLAttributes<HTMLDialogElement>,
    HTMLDialogElement
  > {
  onClickBackdrop?: () => any;
  setDialogRef?: (element: HTMLDialogElement) => any;
}

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

  const setDialogRef = (element: HTMLDialogElement) => {
    dialogRef.current = element;
  };

  return { setDialogRef, open, close };
};

export const Dialog = (props: DialogProps) => {
  props = util.propUnion(defaultProps, props);

  const dialogRef = React.useRef<HTMLDialogElement>();

  const { setDialogRef, dangerouslySetInnerHTML: _0, ...dialogProps } = props;

  const handleSetRef = (element: HTMLDialogElement) => {
    setDialogRef(element);
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
        props.onClickBackdrop?.();
      }
    }
  };

  return (
    <dialog ref={handleSetRef} {...dialogProps} onClick={handleClick}>
      {props.children}
    </dialog>
  );
};

const defaultProps: DialogProps = {
  className: 'recomp-dialog',
};
