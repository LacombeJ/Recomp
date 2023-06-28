import * as React from 'react';

import * as util from '@recomp/utility/common';
import { useDropZone } from './useDropZone';
import { useTimeout } from '@recomp/hooks';
import { DataTransferKind, TransferItem } from './transfer';

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
  onDrop: (items: DataTransferKind[]) => void;
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

type DropZoneContextProps = {
  className?: string;
  classNames?: {
    zone?: string;
    placeholder?: string;
    icon?: string;
    title?: string;
    subtitle?: string;
  };
  children?: React.ReactNode;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  onDrop: (items: DataTransferKind[]) => void;
};

const Context = (props: DropZoneContextProps) => {
  props = util.propUnion(defaultContextProps, props);

  const [dragging, setDragging] = React.useState(false);

  const dropzone = useDropZone(props.onDrop);

  const className = util.classnames({
    [props.className]: true,
    visible: dropzone.dragOver,
    dragging,
  });

  // To unset dragging when user leaves area or stops dragging
  // without it, the dragging property is kept and user can't click within
  // area since pointer-events all in css is activated. And we can't simply just
  // use the document dragleave listener alone because this activates when dragging
  // within the dropzone context. Instead we set a timeout on drag leave that's
  // canceled on every other drag event
  const timeout = useTimeout(500);

  React.useEffect(() => {
    const handleDragOver = () => {
      timeout.cancel();
      setDragging(true);
    };
    const handleDragLeave = () => {
      timeout.begin(() => {
        setDragging(false);
      });
    };
    document.addEventListener('dragover', handleDragOver, null);
    document.addEventListener('dragleave', handleDragLeave, null);
    return () => {
      document.removeEventListener('dragenter', handleDragOver, null);
      document.removeEventListener('dragleave', handleDragLeave, null);
    };
  }, []);

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
    <div
      className={className}
      onDragOver={(e) => {
        timeout.cancel();
        dropzone.dropzoneProps.onDragOver(e);
      }}
      onDragLeave={() => {
        setDragging(false);
        dropzone.dropzoneProps.onDragLeave();
      }}
      onDrop={(e) => {
        setDragging(false);
        dropzone.dropzoneProps.onDrop(e);
      }}
    >
      <div className={props.classNames.zone}>{children}</div>
    </div>
  );
};

const defaultContextProps: Omit<DropZoneContextProps, 'onDrop'> = {
  className: 'recomp-dropzone-context',
  classNames: {
    zone: 'zone',
    placeholder: 'placeholder',
    icon: 'icon',
    title: 'title',
    subtitle: 'subtitle',
  },
  title: 'Drop File',
  subtitle: 'Drop file here to upload.',
  icon: <IconFileUpload></IconFileUpload>,
};

DropZone.Context = Context;
