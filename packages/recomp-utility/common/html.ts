import { readBlob } from './misc';

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
