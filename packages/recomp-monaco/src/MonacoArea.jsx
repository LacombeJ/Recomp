import React from "react";

import MonacoEditor from "./MonacoEditor";

/**
 * @param {MonacoArea.defaultProps} props
 */
const MonacoArea = (props) => {
  /** @type {React.MutableRefObject<monaco.editor.IStandaloneCodeEditor>} */
  const editorRef = React.useRef(null);

  const { onInitialize, options, ...restProps } = props;

  const handleEditorInitialized = (editor, monaco) => {
    editorRef.current = editor;
    editor.focus();
    onInitialize(editor, monaco);
  };

  const className =
    "react-monaco-editor-area" +
    (!!props.className ? " " + props.className : "");

  return (
    <MonacoEditor
      className={className}
      theme="vs-dark"
      value={props.children}
      options={{
        selectOnLineNumbers: true,
        roundedSelection: false,
        readOnly: false,
        cursorStyle: "line",
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
      editorActions={props.editorActions}
      onInitialize={handleEditorInitialized}
      {...restProps}
    ></MonacoEditor>
  );
};

MonacoArea.propTypes = MonacoEditor.propTypes;
MonacoArea.defaultProps = MonacoEditor.defaultProps;

export default MonacoArea;
