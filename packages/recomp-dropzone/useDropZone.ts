import * as React from 'react';
import { DataTransferKind, collectDataTransferItems } from './transfer';

export const useDropZone = (dropCallback: (items: DataTransferKind[]) => void) => {
  const [dragOver, setDragOver] = React.useState(false);

  const onDragOver = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault(); // need to prevent default so onDrop can work
    setDragOver(true);
  };

  const onDragLeave = () => {
    setDragOver(false);
  };

  const onDrop = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();

    setDragOver(false);

    const items = collectDataTransferItems(e.dataTransfer);
    dropCallback(items);
  };

  return {
    dragOver,
    dropzoneProps: { onDragOver, onDragLeave, onDrop },
  };
};
