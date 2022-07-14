// Intended to overwrite the monaco-paste event handler to provide custom paste functionality

import * as dom from 'monaco-editor/esm/vs/base/browser/dom';

export const updatePasteHandler = (editor, handler) => {
  const clipboardEventHandler = (e) => {
    if (e.type === 'paste') {
      const textResult = handler(e);
      if (textResult) {
        let dataTransfer = null;
        try {
          dataTransfer = new DataTransfer();
        } catch (e) {
          // do nothing
        }

        const evt = new ClipboardEvent('paste', {
          clipboardData: dataTransfer,
        });

        evt.clipboardData.setData('text/plain', textResult.text);

        /**
         * Required event details for monaco textAreaInput to call _firePaste:
         * - must be a text event for monaco to process
         * - ClipboardEventUtils.canUseTextData(e) must return true
         *   - must have property e.clipboardData or window.clipboardData must be available
         * - ClipboardEventUtils.getTextData(e) must return a non-empty string
         *   - e.clipboardData.getData('text/plain') must return a non-empty string
         */
        return evt;
      }
    }

    return e;
  };
  wrapPasteHandler(editor, clipboardEventHandler);
};

const wrapPasteHandler = (editor, handler) => {
  const textAreaInput =
    editor['_modelData'].view._textAreaHandler._textAreaInput;

  const disposables = [...textAreaInput._store._toDispose];

  for (let i = 0; i < disposables.length; i++) {
    let newListener = null;
    const oldListener = disposables[i];

    if (oldListener && oldListener._type && oldListener._type === 'paste') {
      const prevHandler = oldListener._handler;
      oldListener.dispose();

      const listener = dom.addDisposableListener(
        textAreaInput.textArea.domNode,
        'paste',
        (e) => {
          const passedEvent = handler(e);
          prevHandler(passedEvent ? passedEvent : e);
        }
      );

      newListener = listener;
    }

    if (newListener) {
      // Because _register is not exposed, just adding to disposable array
      // this is a temporary hack until another way is found
      disposables[i] = newListener;
    }
  }
};
