import { ImageInfo, firstImageFromHTML } from '@recomp/utility/common';
import * as React from 'react';

export const useDropZone = (dropCallback: (items: TransferItem[]) => void) => {
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

    const items: TransferItem[] = [];

    if (e.dataTransfer.items) {
      for (let i = 0; i < e.dataTransfer.items.length; i++) {
        const item = e.dataTransfer.items[i];
        if (item.kind === 'file') {
          items.push({
            kind: 'file',
            type: item.type,
            file: item.getAsFile(),
          });
        } else if (item.kind === 'string') {
          items.push({
            kind: 'string',
            type: item.type,
            item,
          });
        }
      }
    } else if (e.dataTransfer.files) {
      for (let i = 0; i < e.dataTransfer.files.length; i++) {
        const file = e.dataTransfer.files[i];
        items.push({
          kind: 'file',
          type: 'unknown',
          file,
        });
      }
    }

    dropCallback(items);
  };

  return {
    dragOver,
    dropzoneProps: { onDragOver, onDragLeave, onDrop },
  };
};

/** Determines the downloadable image from a list of transfer items */
export const findImageItem = async (
  items: TransferItem[]
): Promise<TransferImage> => {
  let title = null;

  let targetDownload: TransferItem | null = null;
  let htmlInfo: ImageInfo | null = null;

  for (const item of items) {
    if (item.kind === 'string' && item.type === 'text/html') {
      htmlInfo = await new Promise((resolve) => {
        item.item.getAsString((text) => {
          const image = firstImageFromHTML(text);
          resolve(image);
        });
      });
    }

    if (item.type === 'text/uri-list' || item.type.startsWith('image')) {
      targetDownload = item;
    }
  }

  if (htmlInfo) {
    title = htmlInfo.alt;
  }

  if (targetDownload) {
    if (targetDownload.kind === 'file') {
      return {
        title,
        src: {
          kind: 'file',
          value: targetDownload.file,
        },
      };
    } else {
      const target = targetDownload;
      const url = await new Promise<string>((resolve) => {
        target.item.getAsString((text) => {
          resolve(text);
        });
      });
      return {
        title,
        src: {
          kind: 'url',
          value: url,
        },
      };
    }
  }

  if (!targetDownload && htmlInfo) {
    // Try to find image within htmlText
    if (htmlInfo.source.kind === 'base64') {
      return {
        title,
        src: {
          kind: 'base64',
          type: htmlInfo.source.type,
          value: htmlInfo.source.base64,
        },
      };
    } else {
      return {
        title,
        src: {
          kind: 'url',
          value: htmlInfo.source.value,
        },
      };
    }
  }

  return null;
};

// ----------------------------------------------------------------------------

export type TransferItem = TransferString | TransferFile;

export type TransferString = {
  kind: 'string';
  type: string;
  item: DataTransferItem;
};

export type TransferFile = {
  kind: 'file';
  type: string;
  file: File;
};

export type TransferImage = {
  /** Alt attribute or name */
  title: string;
  src:
    | { kind: 'base64'; value: string; type: string }
    | { kind: 'url'; value: string }
    | { kind: 'file'; value: File };
};
