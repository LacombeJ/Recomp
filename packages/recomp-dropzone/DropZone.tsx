import * as React from 'react';

import * as util from '@recomp/utility/common';
import { TransferItem, useDropZone } from './useDropZone';

interface DropZoneProps {
  className?: string;
  classNames?: {
    placeholder?: string;
    icon?: string;
    title?: string;
    subtitle?: string;
  };
  style?: React.CSSProperties;
  children?: React.ReactNode;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  onDrop: (items: TransferItem[]) => void;
}

export const DropZone = (props: DropZoneProps) => {
  props = util.structureUnion(defaultProps, props);

  const { dragOver, dropzoneProps } = useDropZone(props.onDrop);

  const className = util.classnames({
    [props.className]: true,
    dragOver: dragOver,
  });

  let children = props.children;
  if (!children) {
    children = (
      <div className={props.classNames.placeholder}>
        <div className={props.classNames.icon}>{props.icon}</div>
        <div className={props.classNames.title}>{props.title}</div>
        <div className={props.classNames.subtitle}>{props.subtitle}</div>
      </div>
    );
  }

  return (
    <div className={className} style={props.style} {...dropzoneProps}>
      {children}
    </div>
  );
};

const IconFileUpload = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="icon-tabler icon-tabler-file-upload"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      strokeWidth="1"
      stroke="currentColor"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path d="M14 3v4a1 1 0 0 0 1 1h4"></path>
      <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"></path>
      <path d="M12 11v6"></path>
      <path d="M9.5 13.5l2.5 -2.5l2.5 2.5"></path>
    </svg>
  );
};

const defaultProps: Omit<DropZoneProps, 'onDrop'> = {
  className: 'recomp-dropzone',
  classNames: {
    placeholder: 'placeholder',
    icon: 'icon',
    title: 'title',
    subtitle: 'subtitle',
  },
  title: 'Drag and drop file here',
  subtitle: 'Select a file or drop here.',
  icon: <IconFileUpload></IconFileUpload>,
};

// ----------------------------------------------------------------------------
