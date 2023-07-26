import * as React from 'react';

import { propUnion } from '@recomp/props';

import {
  Monaco,
  Editor,
  MonacoEditor,
  MonacoEditorProps,
} from './MonacoEditor';

export const MonacoArea = (props: MonacoEditorProps) => {
  props = propUnion(defaultProps, props);

  const editorRef: React.MutableRefObject<Editor> = React.useRef(null);

  const { onInitialize, options, ...restProps } = props;

  const handleEditorInitialized = (
    editor: Editor,
    monaco: Monaco,
    element: HTMLDivElement
  ) => {
    editorRef.current = editor;
    editor.focus();
    onInitialize?.(editor, monaco, element);
  };

  return (
    <MonacoEditor
      key={props.key}
      className={props.className}
      value={props.value}
      options={{
        selectOnLineNumbers: true,
        roundedSelection: false,
        readOnly: false,
        cursorStyle: 'line',
        automaticLayout: false,
        minimap: { enabled: false },
        insertSpaces: true,
        tabSize: 2,
        quickSuggestions: false,
        suggestOnTriggerCharacters: false,
        wordBasedSuggestions: false,
        parameterHints: { enabled: false },
        links: false,
        ...(options ? options : {}),
      }}
      onInitialize={handleEditorInitialized}
      {...restProps}
    ></MonacoEditor>
  );
};

const defaultProps = {
  className: 'recomp-monaco area',
  theme: 'vs-dark',
};
