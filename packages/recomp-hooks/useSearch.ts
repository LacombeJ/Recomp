import * as React from 'react';
import * as fuzzysort from 'fuzzysort';

export type MatchRange = {
  start: number;
  end: number;
};

export interface SearchResult<T, V extends keyof T> {
  /** Original item */
  item: T;
  /** List of ranges of found search substrings */
  ranges: Record<V, MatchRange[]>;
}

/**
 * Basic fuzzy search/filter results using fuzzysort package.
 */
export const useSearch = <T, V extends keyof T, K extends string & V>(
  search: string,
  list: T[],
  options: { keys: K[] }
): SearchResult<T, V>[] => {
  const filtered = React.useMemo(() => {
    if (search === '') {
      return list.map((item) => {
        const partialRanges: Partial<Record<K[number], MatchRange[]>> = {};
        for (let i = 0; i < options.keys.length; i++) {
          const key = options.keys[i] as K[number];
          partialRanges[key] = calculateMatchRanges(null);
        }
        return {
          item,
          ranges: partialRanges as Record<V, MatchRange[]>,
        };
      });
    }
    const results = fuzzysort.go(search, list, options);

    const filtered: SearchResult<T, V>[] = [];
    for (const result of results) {
      const partialRanges: Partial<Record<K[number], MatchRange[]>> = {};
      for (let i = 0; i < options.keys.length; i++) {
        const key = options.keys[i] as K[number];
        partialRanges[key] = calculateMatchRanges(result[i]);
      }

      filtered.push({
        item: result.obj,
        ranges: partialRanges as Record<V, MatchRange[]>,
      });
    }

    return filtered;
  }, [search, list]);

  return filtered;
};

export const highlightRanges = <T>(
  text: string,
  ranges: MatchRange[],
  callback: (substring: string, index: number, match: boolean) => T
): T[] => {
  const result: T[] = [];

  let keyIndex = 0;
  let last = 0;

  for (let i = 0; i < ranges.length; i++) {
    const range = ranges[i];

    const rawText = text.substring(last, range.start);
    if (rawText.length > 0) {
      result.push(callback(rawText, keyIndex, false));
      keyIndex += 1;
    }

    const rangeText = text.substring(range.start, range.end);
    if (rangeText.length > 0) {
      result.push(callback(rangeText, keyIndex, true));
      keyIndex += 1;
    }

    last = range.end;
  }

  const remainText = text.substring(last);
  if (remainText.length > 0) {
    result.push(callback(remainText, keyIndex, false));
  }

  return result;
};

const calculateMatchRanges = (result?: Fuzzysort.Result) => {
  const ranges: MatchRange[] = [];

  if (result) {
    // Modified logic from fuzzysort.highlight

    let opened = false;
    let start = 0;
    let lastIndex = 0;

    const rawIndexes: number[] & { len: number } = (
      result as any as { _indexes: number[] & { len: number } }
    )._indexes;
    // Don't know what len vs length is but fuzzysort does this
    const indexes = rawIndexes.slice(0, rawIndexes.len).sort((a, b) => a - b);

    for (let i = 0; i < indexes.length; i++) {
      const curr = indexes[i];
      if (!opened) {
        // Called only for the first (init)
        opened = true;
        start = curr;
      } else {
        if (curr === lastIndex + 1) {
          // still, in, just continue
        } else {
          // new is started, push a range
          ranges.push({ start, end: lastIndex + 1 });
          start = curr;
        }
      }

      lastIndex = curr;
    }

    if (opened) {
      // This will be true if any indexes were found, and in that case, push
      // the final range
      ranges.push({ start, end: lastIndex + 1 });
    }
  }

  return ranges;
};
