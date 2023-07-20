import * as React from 'react';

import loader from '@monaco-editor/loader';

import { Monaco } from './MonacoEditor';

// from loader
interface CancelablePromise<T> extends Promise<T> {
  cancel: () => void;
}

export const useMonaco = (
  monacoRef: React.MutableRefObject<Monaco | undefined>,
  callback: (monaco: Monaco) => void
) => {
  // Holding of a cancellable promise. This is so we do not call the loader
  // multiple times
  const cancellableRef = React.useRef<CancelablePromise<Monaco>>(null);

  // Initialize/load monaco on mount if monaco has not been loaded
  React.useEffect(() => {
    if (!monacoRef.current && !cancellableRef.current) {
      cancellableRef.current = loader.init();

      cancellableRef.current
        .then((monaco: Monaco) => {
          monacoRef.current = monaco; // assign monaco
          cancellableRef.current = null; // finished, nullify cancellation
          callback(monaco);
        })
        .catch((err: any) => {
          if (err?.type !== 'cancelation') {
            console.error('Monaco initialization error:', err);
          }
          // Loader finished an failed, nullify cancel
          cancellableRef.current = null;
        });

      // Unmount
      return () => {
        if (cancellableRef.current) {
          // On unmount, cancel loader if it hasn't finished
          cancellableRef.current.cancel();
          cancellableRef.current = null;
        }
      };
    }
  });
};
