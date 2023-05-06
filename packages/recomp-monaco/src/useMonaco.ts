import * as React from 'react';

import loader from '@monaco-editor/loader';

import { useMount } from '@recomp/hooks';

import * as monaco from 'monaco-editor';

type Monaco = typeof monaco;

const useMonaco = (
  monacoRef: React.MutableRefObject<Monaco>,
  callback: (monaco?: Monaco) => void
) => {
  // Holding of a cancellable promise. This is so we do not call the loader
  // multiple times
  /** @type {React.MutableRefObject<Promise<Monaco>>} */
  const cancellableRef = React.useRef(null);

  // Initialize/load monaco on mount if monaco has not been loaded
  useMount(() => {
    if (!monacoRef.current && !cancellableRef.current) {
      cancellableRef.current = loader.init();

      cancellableRef.current
        .then((monaco: Monaco) => {
          monacoRef.current = monaco; // assign monaco
          cancellableRef.current = null; // finished, nullify cancellation
          callback(); // no need to pass monacoRef.current since it was already assigned
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

export default useMonaco;
