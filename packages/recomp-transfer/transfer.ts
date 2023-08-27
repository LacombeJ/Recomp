/*
Utility functions for interpreting a transfer

Would be very nice to have a test module for transfering items. Some examples I used
to test this internally are transfering from (tested in firefox/chrome/edge):
- [x] image web page
- [x] image in search thumbnail
- [x] selected text from webpage
- [x] discord images in chat
- [x] discord images in overlay view
- [x] system file (images, .txt, .json, others)

References:
https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Recommended_drag_types
https://learn.microsoft.com/en-us/windows/win32/dataxchg/html-clipboard-format

*/

/**
 * General parsing of a transfer list. Obtaining images, urls/links, html, text, etc. This
 * prioritizes items in order.
 *
 * Example uses of this could be obtaining an image and downloading it to a server or reading
 * the base64, or obtaining some url and inserting some preview element linking to the url.
 */
export const parseTransferList = async (
  items: DataTransferKind[]
): Promise<TransferItem | null> => {
  // Accessing data from from to bottom, stopping if we have enough information

  // URLs can be found in uri-lists, html text (href links, data-role="img", or img src)
  for (const item of items) {
    if (item.kind === 'string') {
      const res = await parseStringTransfer(item);
      if (res !== null) {
        return res;
      }
    } else if (item.kind === 'file') {
      const res = await parseFileTransfer(item);
      if (res !== null) {
        return res;
      }
    }
  }

  return null;
};

export const parseStringTransfer = async (
  item: DataTransferString
): Promise<TransferItem> => {
  const string = await getTransferString(item);

  if (item.type === 'text/plain') {
    return { type: 'string', text: string };
  }
  if (item.type === 'text/html') {
    const res = parseTextHTML(string);
    if (res !== null) {
      return res;
    }
  } else if (item.type === 'text/x-moz-url') {
    const items = parseMozillaURL(string);
    if (items.length !== 0) {
      return { type: 'links', links: items };
    }
  } else if (item.type === 'text/uri-list') {
    const items = parseURIList(string);
    if (items.length !== 0) {
      return { type: 'links', links: items.map((url) => ({ url })) };
    }
  }

  return null;
};

/** "text/html" */
export const parseTextHTML = (htmlText: string): TransferItem => {
  // References:
  // https://developer.mozilla.org/en-US/docs/Web/API/Element/tagName

  const domParser = new DOMParser();

  const doc = domParser.parseFromString(htmlText, 'text/html');

  // Getting the activeElement children to only get what's in between "StartFragment"
  // and "EndFragment". I did not find this in spec but I've seen in practice

  const active = doc.activeElement;

  // Focusing on fragments if any
  let lo = 0;
  let hi = active.childNodes.length - 1;
  for (let i = 0; i < active.childNodes.length; i++) {
    const node = active.childNodes[i];
    if (node.nodeType === Node.COMMENT_NODE) {
      if (node.textContent === 'StartFragment') {
        lo = i + 1;
      } else if (node.textContent === 'EndFragment') {
        hi = i;
      }
    }
  }

  for (let i = lo; i < hi; i++) {
    const node = active.childNodes[i];
    // Element node (type = 1)
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement;
      if (element.tagName === 'IMG') {
        const info = imageInfo(element as HTMLImageElement);
        const item = imageInfoIntoTransferImage(info);
        return item;
      }
    }
  }

  return null;
};

export type NamedURLs = { url: string; name?: string }[];

/** "text/x-moz-url" */
export const parseMozillaURL = (text: string) => {
  const urls: NamedURLs = [];
  const lines = text.split(/\r?\n/);
  for (let i = 0; i < lines.length; i += 2) {
    let { url, name } = { url: lines[i], name: lines[i + 1] };
    if (name === url) {
      // I've seen cases where entries are copied on subsequent lines, in
      // that case just make the name null to avoid confusion
      name = null;
    }
    urls.push({ url, name });
  }
  return urls;
};

export type URLList = string[];

/** "text/uri-list */
export const parseURIList = (text: string) => {
  const urls: URLList = [];
  const lines = text.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    if (!lines[i].startsWith('#')) {
      urls.push(lines[i]);
    }
  }
  return urls;
};

// ----------------------------------------------------------------------------

export const parseFileTransfer = async (
  item: DataTransferFile
): Promise<TransferItem> => {
  if (item.type === 'application/json') {
    // string; // return plain string
  } else if (item.type.startsWith('image')) {
    // todo image
  }
  return { type: 'file', file: item.file };
};

// ----------------------------------------------------------------------------

export type DataTransferKind = DataTransferString | DataTransferFile;

export type DataTransferString = {
  kind: 'string';
  type: string;
  item: DataTransferItem;
};

export type DataTransferFile = {
  kind: 'file';
  type: string;
  file: File;
};

export type DataTransferImage = {
  /** Alt attribute or name */
  title: string;
  src:
    | { kind: 'base64'; value: string; type: string }
    | { kind: 'url'; value: string }
    | { kind: 'file'; value: File };
};

export const collectDataTransferItems = (transfer: DataTransfer) => {
  const items: DataTransferKind[] = [];

  if (transfer.items) {
    for (let i = 0; i < transfer.items.length; i++) {
      const item = transfer.items[i];
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
  } else if (transfer.files) {
    for (let i = 0; i < transfer.files.length; i++) {
      const file = transfer.files[i];
      items.push({
        kind: 'file',
        type: 'unknown',
        file,
      });
    }
  }

  return items;
};

export const getTransferString = async (item: DataTransferString) => {
  const string: string = await new Promise((resolve) => {
    item.item.getAsString((string) => {
      resolve(string);
    });
  });
  return string;
};

export const getTransferItemAsImage = async (
  item: TransferItem
): Promise<TransferImage> => {
  if (!item) {
    return null;
  }

  if (item.type === 'image') {
    return item;
  } else if (item.type === 'links') {
    return {
      type: 'image',
      image: {
        title: item.links[0].name,
        src: {
          kind: 'url',
          value: item.links[0].url,
        },
      },
    };
  } else if (item.type === 'file') {
    const image = await readImageBlobBase64(item.file);
    if (image.parsed) {
      return {
        type: 'image',
        image: {
          title: item.file.name,
          src: {
            kind: 'base64',
            type: image.parsed.type,
            value: image.parsed.body,
          },
        },
      };
    }
  }
};

// ----------------------------------------------------------------------------

export type TransferItem =
  | TransferText
  | TransferLinks
  | TransferImage
  | TransferFile;

export type TransferText = {
  type: 'string';
  text: string;
};

export type TransferLinks = {
  type: 'links';
  links: TransferLink[];
};

export type TransferLink = {
  url: string;
  name?: string;
};

export type TransferImage = {
  type: 'image';
  image: {
    title: string;
    src:
      | { kind: 'base64'; value: string; type: string }
      | { kind: 'url'; value: string }
      | { kind: 'file'; value: File };
  };
};

export type TransferFile = {
  type: 'file';
  file: File;
};

const imageInfoIntoTransferImage = (image: ImageInfo): TransferImage => {
  if (image) {
    // Try to find image within htmlText
    if (image.source.kind === 'base64') {
      return {
        type: 'image',
        image: {
          title: image.alt,
          src: {
            kind: 'base64',
            type: image.source.type,
            value: image.source.base64,
          },
        },
      };
    } else {
      return {
        type: 'image',
        image: {
          title: image.alt,
          src: {
            kind: 'url',
            value: image.source.value,
          },
        },
      };
    }
  }
  return null;
};

// ----------------------------------------------------------------------------

// Utility

export const readBlob = async (blob: Blob): Promise<string> => {
  return await new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = (_progress: ProgressEvent<FileReader>) => {
      const result = reader.result.toString();
      resolve(result);
    };
  });
};

/**
 * This function parses html text and finds the first image in the DOM. It will
 * look at the src attribute and return a URI or base64 type
 */
export const findImageFromHTML = (htmlText: string) => {
  const domParser = new DOMParser();
  const doc = domParser.parseFromString(htmlText, 'text/html');

  let targetInfo: ImageInfo | null = null;
  for (let i = 0; i < doc.images.length; i++) {
    const image = doc.images[i];

    const info = imageInfo(image);
    if (info) {
      if (!targetInfo) {
        targetInfo = info;
      } else {
        if (!targetInfo.alt && info.alt) {
          targetInfo = info;
        }
      }
    }
  }

  return targetInfo;
};

export type ImageInfo = {
  source: SourceBase64 | SourceValue;
  alt: string;
};
export type SourceBase64 = {
  kind: 'base64';
  type: string;
  base64: string;
};
export type SourceValue = {
  kind: 'value';
  value: string;
};

export const imageInfo = (image: HTMLImageElement): ImageInfo | null => {
  if (image) {
    const alt = image.alt;
    const src = image.src;
    const parsed = parseImageBase64(src);
    if (parsed) {
      return {
        source: {
          kind: 'base64',
          type: parsed.type,
          base64: parsed.body,
        },
        alt,
      };
    } else {
      return {
        source: {
          kind: 'value',
          value: src,
        },
        alt,
      };
    }
  }
  return null;
};

export const parseImageBase64 = (base64: string) => {
  const regex = /^(data:image\/([^;]*);base64,)(.*)$/;
  const matches = regex.exec(base64);
  if (matches) {
    return {
      header: matches[1],
      type: matches[2],
      body: matches[3],
    };
  }
  return null;
};

export const base64Header = (type: string, body: string) => {
  return `data:${type};base64,${body}`;
};

export const base64ImageHeader = (type: string, body: string) => {
  return base64Header(`image/${type}`, body);
};

export const readImageBlobBase64 = async (blob: Blob) => {
  const base64 = await readBlob(blob);
  const parsed = parseImageBase64(base64);
  return { base64, parsed };
};
