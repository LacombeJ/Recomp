import React from 'react';
import PropTypes from 'prop-types';
import stylePropType from 'react-style-proptype';

import { useResizeDetector } from 'react-resize-detector';

import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

import 'monaco-editor/esm/vs/language/typescript/monaco.contribution';
import 'monaco-editor/esm/vs/language/css/monaco.contribution';
import 'monaco-editor/esm/vs/language/json/monaco.contribution';
import 'monaco-editor/esm/vs/language/html/monaco.contribution';
import 'monaco-editor/esm/vs/basic-languages/monaco.contribution';

import { updatePasteHandler as updateProcessPasteHandler } from './monaco-paste';

/** @extends {React.Component<MonacoEditorProps>} */
class MonacoEditorComponent extends React.Component {
  constructor(props) {
    super(props);

    /** @type {monaco.editor.IStandaloneCodeEditor} */
    this.editor = null;
    this.containerRef = React.createRef();
    this.preventChange = false;
    this.oldDecorations = [];
    /** @type {monaco.IDisposable[]} */
    this.currentActions = [];

    /**
     * For subscriptions, we need to make sure we also pass the editor
     * text at the time of update. The reason is, these subscriptions are
     * usually called after some edit and may interfere with monacos text model
     * if text props is not updated properly.
     */
    this.subscriptions = {
      modelContentChanged: null,
      cursorPositionChanged: null,
    };

    this.handlers = {
      processPaste: null,
    };
  }

  componentDidMount() {
    const props = this.props;

    const value = props.value != null ? props.value : props.defaultValue;

    const options = {
      value,
      language: props.language,
      ...props.options,
    };

    if (props.theme) {
      options.theme = props.theme;
    }

    this.editor = monaco.editor.create(
      this.containerRef.current,
      options,
      props.overrideServices
    );

    updateProcessPasteHandler(this.editor, (e) => {
      return this.handlers.processPaste(e);
    });

    this.subscriptions.modelContentChanged =
      this.createNewModelContentChangedSubscription(props.onChange);
    this.subscriptions.cursorPositionChanged =
      this.createNewCursorPositionChangedSubscription(
        props.onCursorPositionChange
      );

    if (props.onCursorPositionChange) {
      // Initialize with cursor location
      const pos = this.editor.getPosition();
      props.onCursorPositionChange(this.editor.getValue(), null, {
        line: pos.lineNumber,
        column: pos.column,
      });
    }

    this.handlers.processPaste = props.onProcessPaste;

    props.onInitialize(this.editor, monaco, this.containerRef.current);
  }

  componentDidUpdate(prevProps) {
    const props = this.props;

    const model = this.editor.getModel();

    // Calling layout on all updates.
    // This is to fix issue with monaco editor resizing lag/stutter
    this.editor.layout();

    // Edit text
    if (
      props.value != null &&
      props.value !== model.getValue() &&
      (!props.editOperations || props.editOperations.length == 0)
    ) {
      this.preventChange = true;
      this.editor.pushUndoStop();
      model.pushEditOperations(
        [],
        [
          {
            range: model.getFullModelRange(),
            text: props.value,
          },
        ]
      );
      this.editor.pushUndoStop();
      this.preventChange = false;
    } else if (props.editOperations && props.editOperations.length > 0) {
      const edits = props.editOperations.map(({ range, value }) => {
        return {
          range: new monaco.Range(
            range.start.line,
            range.start.column,
            range.end.line,
            range.end.column
          ),
          text: value,
        };
      });
      model.pushEditOperations([], edits);
    }

    // Update decorations
    if (
      this.oldDecorations.length > 0 &&
      (!props.stateDecorations || props.stateDecorations.length === 0)
    ) {
      this.oldDecorations = this.editor.deltaDecorations(
        this.oldDecorations,
        []
      );
    } else if (props.stateDecorations && props.stateDecorations.length > 0) {
      const decors = props.stateDecorations.map(({ range, options }) => {
        return {
          range: new monaco.Range(
            range.start.line,
            range.start.column,
            range.end.line,
            range.end.column
          ),
          options,
        };
      });
      this.oldDecorations = this.editor.deltaDecorations(
        this.oldDecorations,
        decors
      );
    }

    // Update actions
    if (
      prevProps.editorActions !== props.editorActions ||
      this.currentActions.length !== props.editorActions.length
    ) {
      if (
        (this.currentActions.length === 0 &&
          props.editorActions.length !== 0) ||
        prevProps.editorActions.length > 0 ||
        props.editorActions.length > 0
      ) {
        // Remove all previous editor actions
        for (let i = 0; i < this.currentActions.length; i++) {
          const action = this.currentActions[i];
          action.dispose();
        }
        this.currentActions = [];

        // Add new actions
        for (let i = 0; i < props.editorActions.length; i++) {
          const action = props.editorActions[i];
          const disposableAction = this.editor.addAction({
            id: action.id,
            label: action.label,
            keybindings: action.keybindings,
            precondition: null,
            keybindingContext: null,
            run: () => {
              action.run();
            },
          });
          this.currentActions.push(disposableAction);
        }
      }
    }

    if (prevProps.language !== props.language) {
      monaco.editor.setModelLanguage(model, props.language);
    }
    if (prevProps.theme !== props.theme) {
      monaco.editor.setTheme(props.theme);
    }

    if (prevProps.options !== props.options) {
      const { model: _model, ...optionsWithoutModel } = props.options;
      this.editor.updateOptions(optionsWithoutModel);
    }

    if (prevProps.onChange !== props.onChange) {
      if (this.subscriptions.modelContentChanged) {
        this.subscriptions.modelContentChanged.dispose();
      }
      this.subscriptions.modelContentChanged =
        this.createNewModelContentChangedSubscription(props.onChange);
    }

    if (prevProps.onCursorPositionChange !== props.onCursorPositionChange) {
      if (this.subscriptions.cursorPositionChanged) {
        this.subscriptions.cursorPositionChanged.dispose();
      }
      this.subscriptions.cursorPositionChanged =
        this.createNewCursorPositionChangedSubscription(
          props.onCursorPositionChange
        );
    }

    if (prevProps.onProcessPaste !== props.onProcessPaste) {
      this.handlers.processPaste = props.onProcessPaste;
    }
  }

  createNewModelContentChangedSubscription(onChange) {
    return this.editor.onDidChangeModelContent((event) => {
      if (!this.preventChange) {
        const eventPosition = this.editor.getPosition();
        const position = {
          line: eventPosition.lineNumber,
          column: eventPosition.column,
        };
        onChange(this.editor.getValue(), event, position);
      }
    });
  }

  createNewCursorPositionChangedSubscription(onCursorPositionChange) {
    return this.editor.onDidChangeCursorPosition((event) => {
      if (!this.preventChange) {
        if (event.reason !== monaco.editor.CursorChangeReason.Explicit) {
          // If event was caused by some update to the text model,
          // we will not output cursor position change event.
          // Instead, the onChange callback will pass along the modified
          // cursor position and should be handled there.
          // The reason for this is to make sure the cursor pos and text
          // model are in sync. If we update the cursor and not the
          // text model, it will result in errors thrown by monaco.
          return;
        }
        const position = {
          line: event.position.lineNumber,
          column: event.position.column,
        };
        onCursorPositionChange(this.editor.getValue(), event, position);
      }
    });
  }

  componentWillUnmount() {
    if (this.subscriptions.modelContentChanged) {
      this.subscriptions.modelContentChanged.dispose();
      this.subscriptions.modelContentChanged = null;
    }
    if (this.subscriptions.cursorPositionChanged) {
      this.subscriptions.cursorPositionChanged.dispose();
      this.subscriptions.cursorPositionChanged = null;
    }
    if (this.editor) {
      const model = this.editor.getModel();
      if (model) {
        model.dispose();
      }
      this.editor.dispose();
    }
  }

  render() {
    let style = this.props.style;

    const className =
      'react-monaco-editor-container' +
      (!!this.props.className ? ' ' + this.props.className : '');

    return (
      <div
        ref={this.containerRef}
        className={className}
        style={style}
        onDragOver={this.props.onDragOver}
        onDrop={this.props.onDrop}
        onDragLeaveCapture={this.props.onDragLeaveCapture}
      ></div>
    );
  }
}

const editOperationsPropType = PropTypes.arrayOf(
  PropTypes.shape({
    range: PropTypes.shape({
      start: PropTypes.shape({
        line: PropTypes.number,
        column: PropTypes.number,
      }),
      end: PropTypes.shape({
        line: PropTypes.number,
        column: PropTypes.number,
      }),
    }),
    value: PropTypes.string,
  })
);

const stateDecorationsPropType = PropTypes.arrayOf(
  PropTypes.shape({
    range: PropTypes.shape({
      start: PropTypes.shape({
        line: PropTypes.number,
        column: PropTypes.number,
      }),
      end: PropTypes.shape({
        line: PropTypes.number,
        column: PropTypes.number,
      }),
    }),
    options: PropTypes.object,
  })
);

const editorActionsPropType = PropTypes.arrayOf(
  PropTypes.shape({
    id: PropTypes.string,
    label: PropTypes.string,
    keybindings: PropTypes.arrayOf(PropTypes.number),
    run: PropTypes.func,
  })
);

MonacoEditorComponent.propTypes = {
  className: PropTypes.string,
  style: stylePropType,
  value: PropTypes.string,
  defaultValue: PropTypes.string,
  editOperations: editOperationsPropType,
  stateDecorations: stateDecorationsPropType,
  editorActions: editorActionsPropType,
  language: PropTypes.string,
  theme: PropTypes.string,
  options: PropTypes.object,
  overrideServices: PropTypes.object,
  onInitialize: PropTypes.func,
  onChange: PropTypes.func,
  onCursorPositionChange: PropTypes.func,
  onDragOver: PropTypes.func,
  onDrop: PropTypes.func,
  onDragLeaveCapture: PropTypes.func,
};

/**
 * @typedef {MonacoEditor.defaultProps} MonacoEditorProps
 */
MonacoEditorComponent.defaultProps = {
  className: '',
  style: {},
  value: null,
  defaultValue: '',
  editOperations: [],
  stateDecorations: [],
  editorActions: [],
  language: 'javascript',
  theme: null,
  /** @type {monaco.editor.IStandaloneEditorConstructionOptions} */
  options: {},
  overrideServices: {},
  onInitialize: () => {},
  onChange: () => {},
  onCursorPositionChange: () => {},
  onProcessPaste: () => {},
  onDragOver: () => {},
  onDrop: () => {},
  onDragLeaveCapture: () => {},
};

// ----------------------------------------------------------------------------

/** @param {MonacoEditor.defaultProps} props */
const MonacoEditor = (props) => {
  /** @type {React.MutableRefObject<monaco.editor.IStandaloneCodeEditor>} */
  const editorRef = React.useRef(null);
  const targetRef = React.useRef(null);

  const { onInitialize, ...restProps } = props;

  const onResize = React.useCallback(() => {
    if (editorRef.current) {
      // Necessary for browser/window resizes
      editorRef.current.layout();
    }
  }, []);

  const handleEditorInitialized = (editor, monaco, container) => {
    editorRef.current = editor;
    editor.focus();
    onInitialize(editor, monaco);
    targetRef.current = container;
  };

  useResizeDetector({ targetRef, onResize });

  return (
    <MonacoEditorComponent
      {...restProps}
      onInitialize={handleEditorInitialized}
    />
  );
};

MonacoEditor.propTypes = MonacoEditorComponent.propTypes;
MonacoEditor.defaultProps = MonacoEditorComponent.defaultProps;

export default MonacoEditor;
