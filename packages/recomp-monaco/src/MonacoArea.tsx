import * as React from 'react';

import * as util from '@recomp/utils';

import MonacoEditor, { MonacoEditorProps } from './MonacoEditor';

import * as monaco from 'monaco-editor';

type Monaco = typeof monaco;
type Editor = monaco.editor.IStandaloneCodeEditor;

/**
 * @param {MonacoArea.defaultProps} props
 */
const MonacoArea = (props: MonacoEditorProps) => {
  props = util.structureUnion(defaultProps, props);

  const editorRef: React.MutableRefObject<Editor> = React.useRef(null);

  const { onInitialize, options, ...restProps } = props;

  const handleEditorInitialized = (
    editor: Editor,
    monaco: Monaco,
    element: HTMLDivElement
  ) => {
    editorRef.current = editor;
    editor.focus();
    onInitialize(editor, monaco, element);
  };

  return (
    <MonacoEditor
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
  className: 'react-monaco-editor-area',
  theme: 'vs-dark',
};

export default MonacoArea;
