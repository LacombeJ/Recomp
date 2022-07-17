// React component for the monaco editor
// Based on @monaco-editor/react

import React from 'react';
import PropTypes from 'prop-types';
import stylePropType from 'react-style-proptype';

import loader from '@monaco-editor/loader';

import { useResizeDetector } from 'react-resize-detector';

import {
  useMount,
  usePostEffect,
  useStateOrProps,
  usePrevious,
} from '@recomp/hooks';

/** @typedef {import('monaco-editor')} Monaco */
/** @typedef {import('monaco-editor').IDisposable} Disposable */
/** @typedef {import('monaco-editor').editor.IStandaloneCodeEditor} Editor */
/** @typedef {import('monaco-editor').editor.ICodeEditorViewState} ViewState */
/** @typedef {import('monaco-editor').editor.IActionDescriptor} EditorAction */
/** @typedef {import('monaco-editor').editor.IStandaloneEditorConstructionOptions} Options */
/** @typedef {import('monaco-editor').editor.IActionDescriptor} EditorAction */
/** @typedef {import('monaco-editor').editor.IEditorOverrideServices} OverrideServices */
/** @typedef {import('monaco-editor').editor.IModelChangedEvent} ModelChangedEvent */
/** @typedef {import('monaco-editor').editor.ICursorPositionChangedEvent} CursorChangedEvent */

/** @param {MonacoEditor.defaultProps} props */
const MonacoEditor = (props) => {
  // State

  const [isEditorReady, setIsEditorReady] = React.useState(false);
  const [isMonacoMounted, setIsMonacoMounted] = React.useState(false);

  // Prop or State

  const [viewStates, setViewStates] = useStateOrProps(
    {},
    props.viewStates,
    props.onSetViewStates,
    props.viewStates !== null
  );

  // Fields

  /** @type {React.MutableRefObject<Monaco>} */
  const monacoRef = React.useRef(null);
  /** @type {React.MutableRefObject<Editor>} */
  const editorRef = React.useRef(null);
  /** @type {React.MutableRefObject<HTMLElement>} */
  const containerRef = React.useRef(null);

  /** @type {React.MutableRefObject<StateDecoration[]>} */
  const oldDecorations = React.useRef([]);

  /** @type {React.MutableRefObject<Disposable[]>} */
  const currentActions = React.useRef([]);

  const preventChange = React.useRef(null);

  /**
   * For subscriptions, we need to make sure we also pass the editor
   * text at the time of update. The reason is, these subscriptions are
   * usually called after some edit and may interfere with monacos text model
   * if text props is not updated properly.
   */
  const subscriptions = React.useRef({
    /** @type {Disposable} */
    modelContentChanged: null,
    /** @type {Disposable} */
    cursorPositionChanged: null,
  });

  const handlers = React.useRef({
    processPaste: null,
  });

  const onMountRef = React.useRef(props.onMount);
  const beforeMountRef = React.useRef(props.onBeforeMount);

  // Other

  const previousPath = usePrevious(props.path);

  // ----------------------------------------------------------------------------

  // Effects

  // Initialize/load monaco on mount
  useMount(() => {
    const cancellable = loader.init();

    // Mount
    cancellable
      .then((monaco) => {
        monacoRef.current = monaco;
        setIsMonacoMounted(true);
      })
      .catch((err) => {
        if (err?.type !== 'cancelation') {
          console.error('Monaco initialization error:', err);
        }
      });

    // Unmount
    return () => {
      if (editorRef.current) {
        if (subscriptions.current.modelContentChanged) {
          subscriptions.current.modelContentChanged.dispose();
          subscriptions.current.modelContentChanged = null;
        }

        if (subscriptions.current.cursorPositionChanged) {
          subscriptions.current.cursorPositionChanged.dispose();
          subscriptions.current.cursorPositionChanged = null;
        }

        if (props.keepCurrentModel) {
          if (props.saveViewState) {
            setViewStates({
              ...viewStates,
              [props.path]: editorRef.current.saveViewState(),
            });
          }
        } else {
          const model = editorRef.current.getModel();
          if (model) {
            model.dispose();
          }
        }

        editorRef.current.dispose();
      } else {
        cancellable.cancel();
      }
    };
  });

  // Create editor when mounted and ready
  React.useEffect(() => {
    if (isMonacoMounted && !isEditorReady) {
      const value = props.value != null ? props.value : props.defaultValue;
      const model = getOrCreateModel(
        monacoRef.current,
        value,
        props.language,
        props.path
      );

      // Set editor ref
      editorRef.current = monacoRef.current.editor.create(
        containerRef.current,
        {
          model,
          ...props.options,
        },
        props.overrideServices
      );

      if (props.saveViewState) {
        // Restore view state if exist in map
        editorRef.current.restoreViewState(viewStates[props.path]);
      }

      monacoRef.current.editor.setTheme(props.theme);

      setIsEditorReady(true);
    }
  }, [
    isMonacoMounted,
    isEditorReady,
    props.value,
    props.defaultValue,
    props.language,
    props.path,
    props.options,
    props.overrideServices,
    props.saveViewState,
    props.theme,
  ]);

  // Update model and save / restore view states when path/id changes
  usePostEffect(
    () => {
      const value = props.value != null ? props.value : props.defaultValue;
      const model = getOrCreateModel(
        monacoRef.current,
        value,
        props.language,
        props.path
      );

      if (model !== editorRef.current.getModel()) {
        if (props.saveViewState) {
          // Save view state before changing model
          editorRef.current.restoreViewState();
          setViewStates({
            ...viewStates,
            [previousPath]: editorRef.current.saveViewState(),
          });
        }

        // Update model
        editorRef.current.setModel(model);

        if (props.saveViewState) {
          // Restore view state if exist in map
          editorRef.current.restoreViewState(viewStates[props.path]);
        }
      }
    },
    [props.path],
    isEditorReady
  );

  // Update options if modified
  usePostEffect(
    () => {
      editorRef.current.updateOptions(props.options);
    },
    [props.options],
    isEditorReady
  );

  // Edit text
  usePostEffect(
    () => {
      if (
        editorRef.current.getOption(
          monacoRef.current.editor.EditorOption.readOnly
        )
      ) {
        // If read only, set text to whatever value passed through props
        editorRef.current.setValue(props.value);
      } else {
        // If not read-only, check if value has changed or if edit operations provided
        const hasEditOperations =
          props.editOperations && props.editOperations.length > 0;
        if (
          props.value !== editorRef.current.getValue() &&
          !hasEditOperations
        ) {
          // Value has change, update full text
          const model = editorRef.current.getModel();
          preventChange.current = true;
          editorRef.current.pushUndoStop();
          model.pushEditOperations(
            [],
            [
              {
                range: model.getFullModelRange(),
                text: props.value,
              },
            ]
          );
          editorRef.current.pushUndoStop();
          preventChange.current = false;
        } else if (hasEditOperations) {
          // Edit operations passed, push edits
          const edits = props.editOperations.map(({ range, text }) => {
            return {
              range: new monacoRef.current.Range(
                range.start.line,
                range.start.column,
                range.end.line,
                range.end.column
              ),
              text,
            };
          });
          const model = editorRef.current.getModel();
          model.pushEditOperations([], edits);
        }
      }
    },
    [props.value],
    isEditorReady
  );

  // Update decorations
  usePostEffect(
    () => {
      const hasDecorations =
        props.stateDecorations && props.stateDecorations.length > 0;
      if (oldDecorations.current.length > 0 && !hasDecorations) {
        oldDecorations.current = editorRef.current.deltaDecorations(
          oldDecorations.current,
          []
        );
      } else if (hasDecorations) {
        const decors = props.stateDecorations.map(({ range, options }) => {
          return {
            range: new monacoRef.current.Range(
              range.start.line,
              range.start.column,
              range.end.line,
              range.end.column
            ),
            options,
          };
        });
        oldDecorations.current = editorRef.current.deltaDecorations(
          oldDecorations.current,
          decors
        );
      }
    },
    [props.stateDecorations],
    isEditorReady
  );

  // Update actions
  // Editor actions are tied to the passed props. Meaning they are added when
  // new actions are added and removed when they are no longer passed through
  // the component.
  usePostEffect(
    () => {
      // editorActions props have changed. The only time where we will not update
      // this, is if the props is a new empty array that is technically "different"
      // from the previous empty array passed
      if (
        currentActions.current.length !== 0 ||
        props.editorActions.length !== 0
      ) {
        // Remove all previous editor actions
        for (let i = 0; i < currentActions.current.length; i++) {
          currentActions.current[i].dispose();
        }
        currentActions.current = [];

        // Add new actions
        for (let i = 0; i < props.editorActions.length; i++) {
          const action = props.editorActions[i];
          const disposableAction = editorRef.current.addAction(action);
          currentActions.current.push(disposableAction);
        }
      }
    },
    [props.editorActions],
    isEditorReady
  );

  // Update language
  usePostEffect(
    () => {
      monacoRef.current.editor.setModelLanguage(model, props.language);
    },
    [props.language],
    isEditorReady
  );

  // Update theme
  usePostEffect(
    () => {
      monacoRef.current.editor.setTheme(model, props.theme);
    },
    [props.theme],
    isEditorReady
  );

  // Update line
  usePostEffect(
    () => {
      editorRef.current.revealLine(props.line);
    },
    [props.line],
    isEditorReady
  );

  // ----------------------------------------------------------------------------

  // Callbacks

  // TODO: onInitialize

  // TODO: onChange

  // TODO: onCursorPositionChange

  // TODO: onProcessPaste

  // ----------------------------------------------------------------------------

  // Render

  // On all re-render, we will layout editor if possible
  if (editorRef.current) {
    editorRef.current.layout();
  }

  return (
    <div
      ref={containerRef}
      className={props.className}
      style={props.style}
      onDragOver={props.onDragOver}
      onDrop={props.onDrop}
      onDragLeaveCapture={props.onDragLeaveCapture}
    >
      {props.children}
    </div>
  );
};

// ----------------------------------------------------------------------------

/**
 *
 * @param {Monaco} monaco
 * @param {string} value
 * @param {string} language
 * @param {string} path
 */
const getOrCreateModel = (monaco, value, language, path) => {
  let model = monaco.editor.getModel(monaco.Uri.parse(path));
  if (!model) {
    model = monaco.editor.createModel(value, language, monaco.Uri.parse(path));
  }
  return model;
};

// ----------------------------------------------------------------------------

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
    text: PropTypes.string,
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

MonacoEditor.propTypes = {
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
  line: PropTypes.number,
  viewStates: PropTypes.object,
  saveViewState: PropTypes.bool,
  keepCurrentModel: PropTypes.bool,
  onInitialize: PropTypes.func,
  onChange: PropTypes.func,
  onCursorPositionChange: PropTypes.func,
  onDragOver: PropTypes.func,
  onDrop: PropTypes.func,
  onDragLeaveCapture: PropTypes.func,
  onSetViewStates: PropTypes.func,
};

MonacoEditor.defaultProps = {
  className: 'react-monaco-editor-container',
  /** @type {React.CSSProperties} */
  style: {},

  /**
   * The path or id associated with this given document instance
   * @type {string}
   */
  path: '',

  /** @type {string?} */
  value: null,
  /** @type {string?} */
  defaultValue: '',

  /** @type {EditOperation[]} */
  editOperations: [],
  /** @type {StateDecoration[]} */
  stateDecorations: [],
  /** @type {EditorAction[]} */
  editorActions: [],

  language: 'javascript',
  /** @type {string?} */
  theme: null,

  /** @type {Options} */
  options: {},
  /** @type {OverrideServices} */
  overrideServices: {},

  /** @type {number?} */
  line: null,

  /** @type {Object<string,ViewState>?} */
  viewStates: null,
  saveViewState: false,
  keepCurrentModel: false,

  /** @type {(editor: Editor, monaco: Monaco, container: HTMLElement) => void} */
  onInitialize: () => {},
  /** @type {(value: string, event: ModelChangedEvent, position: Position) => void} */
  onChange: () => {},
  /** @type {(value: string, event: CursorChangedEvent, position: Position) => void} */
  onCursorPositionChange: () => {},
  /** @type {(event: any) => void} */
  onProcessPaste: () => {},
  /** @type {React.DragEventHandler<HTMLDivElement>} */
  onDragOver: () => {},
  /** @type {React.DragEventHandler<HTMLDivElement>} */
  onDrop: () => {},
  /** @type {React.DragEventHandler<HTMLDivElement>} */
  onDragLeaveCapture: () => {},
  /** @type {(states: Object<string,ViewState>) => void} */
  onSetViewStates: () => {},
};

/**
 * @typedef {{ line: number, column: number }} Position
 */

/**
 * @typedef {{
 *   range: { start: Position, end: Position }
 *   text: string
 * }} EditOperation
 */

/**
 * @typedef {{
 *   range: { start: Position, end: Position }
 *   options: monaco.editor.IModelDecorationOptions
 * }} StateDecoration
 */

export default MonacoEditor;
