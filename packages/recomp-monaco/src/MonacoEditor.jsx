// React component for the monaco editor
// Based on @monaco-editor/react

import React from 'react';
import PropTypes from 'prop-types';
import stylePropType from 'react-style-proptype';

import loader from '@monaco-editor/loader';

import { useResizeDetector } from 'react-resize-detector';

import { updatePasteHandler } from './monaco-paste';

import { classnames } from '@recomp/utils';

import {
  useMount,
  usePostEffect,
  useStateOrProps,
  usePrevious,
  useEffectOnReady,
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
  // Assuming that this component can unmount and remount at any time, and
  // that we have no idea when this is because the component is truly unmounting or
  // if because an HMR function is re-rendering the component, we will save all monaco
  // states (text, cursor, scroll, etc) within the component to re-apply after remount.

  // We are running most of logic of this component only after the loader has
  // loaded monaco and we "mount" monaco. Since this happens outside of react,
  // we are using a state to re-render the component and perform post-monaco-mounted
  // logic.
  const [isMonacoMounted, setIsMonacoMounted] = React.useState(false);

  // Set whenever editor has been created and unset when editor is disposed
  const [isEditorReady, setIsEditorReady] = React.useState(false);

  // State or Prop option

  // Saving the monaco editor text
  const [value, setValue] = useStateOrProps(
    '',
    props.value,
    props.onChange,
    props.value !== null
  );

  // Saving the monaco view state
  const [viewStates, setViewStates] = useStateOrProps(
    {},
    props.viewStates,
    props.onSetViewStates,
    props.viewStates !== null
  );

  // Fields

  // Holding of a cancellable promise. This is so we do not call the loader
  // multiple times
  /** @type {React.MutableRefObject<Promise<Monaco>>} */
  const cancellableRef = React.useRef(null);

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
    processPaste: () => {},
  });

  // Other

  const previousPath = usePrevious(props.path);

  // ----------------------------------------------------------------------------

  // Effects

  // Initialize/load monaco on mount if monaco has not been loaded
  useMount(() => {
    if (!monacoRef.current && !cancellableRef.current) {
      cancellableRef.current = loader.init();

      cancellableRef.current
        .then((monaco) => {
          monacoRef.current = monaco; // assign monaco
          cancellableRef.current = null; // finished, nullify cancellation
          setIsMonacoMounted(true); // trigger react component update
        })
        .catch((err) => {
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

  // Editor Creation
  // Create editor when mounted and ready
  React.useEffect(() => {
    if (isMonacoMounted && !editorRef.current) {
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

      // Note that this callback is created with the editor above
      // This function overrides the paste handler by wrapping the current one
      // with a custom one defined here. We don't want to perform this step
      // more than once so we will do it here after editor creation
      updatePasteHandler(editorRef.current, (e) => {
        return handlers.current.processPaste(e);
      });

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
    props.language,
    props.path,
    props.options,
    props.overrideServices,
    props.saveViewState,
    props.theme,
  ]);

  // Handle disposing editor on unmount
  useMount(() => {
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

        if (props.saveViewState) {
          setViewStates({
            ...viewStates,
            [props.path]: editorRef.current.saveViewState(),
          });
        }

        // Dispose model
        const model = editorRef.current.getModel();
        if (model) {
          model.dispose();
        }

        // Dispose editor
        editorRef.current.dispose();
        editorRef.current = null;

        setIsEditorReady(false);
      }
    };
  });

  // ----------------------------------------------------------------------------

  // Editor ready effects
  // These effects will be applied right after the editor is ready OR when props
  // change. This is different than the "post editor" effects below since these
  // types of effects are not handled during editor creation

  useEffectOnReady(
    () => {
      if (props.saveViewState) {
        editorRef.current.restoreViewState(viewStates[props.path]);
      }
    },
    [viewStates],
    isEditorReady
  );

  // Update decorations
  useEffectOnReady(
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
  useEffectOnReady(
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

  // Update line
  useEffectOnReady(
    () => {
      if (props.line) {
        editorRef.current.revealLine(props.line);
      }
    },
    [props.line],
    isEditorReady
  );

  // ----------------------------------------------------------------------------

  // Post editor effects
  // These effects are only applied after certains props change
  // POST editor creation. Since otherwise, the editor will already
  // have these values set on creation (value, lang, theme, etc)

  // Update model and save / restore view states when path/id changes
  usePostEffect(
    () => {
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
        editorRef.current.setValue(value);
      } else {
        // If not read-only, check if value has changed or if edit operations provided
        const hasEditOperations =
          props.editOperations && props.editOperations.length > 0;
        if (value !== editorRef.current.getValue() && !hasEditOperations) {
          // Value has change, update full text
          const model = editorRef.current.getModel();
          preventChange.current = true;
          editorRef.current.pushUndoStop();
          model.pushEditOperations(
            [],
            [
              {
                range: model.getFullModelRange(),
                text: value,
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
    [props.value], // we don't need to use (state) value - monaco handles this internally
    isEditorReady
  );

  // Update language
  usePostEffect(
    () => {
      const model = editorRef.current.getModel();
      monacoRef.current.editor.setModelLanguage(model, props.language);
    },
    [props.language],
    isEditorReady
  );

  // Update theme
  usePostEffect(
    () => {
      monacoRef.current.editor.setTheme(props.theme);
    },
    [props.theme],
    isEditorReady
  );

  // ----------------------------------------------------------------------------

  // Callbacks

  // onInitialize
  useEffectOnReady(
    () => {
      props.onInitialize(
        editorRef.current,
        monacoRef.current,
        containerRef.current
      );
    },
    [],
    isEditorReady
  );

  // onChange
  useEffectOnReady(
    () => {
      if (subscriptions.current.modelContentChanged) {
        subscriptions.current.modelContentChanged.dispose();
        subscriptions.current.modelContentChanged = null;
      }

      subscriptions.current.modelContentChanged =
        editorRef.current.onDidChangeModelContent((event) => {
          if (!preventChange.current) {
            const eventPosition = editorRef.current.getPosition();
            const position = {
              line: eventPosition.lineNumber,
              column: eventPosition.column,
            };
            // Calls onChange if managing using props, otherwise updates internal state
            // We do this because we need to keep track of editor text in case
            // of an refresh (unmount/remount where state/refs are not reset)
            setValue(editorRef.current.getValue(), event, position);
          }
        });
    },
    [props.onChange],
    isEditorReady
  );

  // onCursorPositionChange
  useEffectOnReady(
    () => {
      if (subscriptions.current.cursorPositionChanged) {
        subscriptions.current.cursorPositionChanged.dispose();
        subscriptions.current.cursorPositionChanged = null;
      }

      subscriptions.current.cursorPositionChanged =
        editorRef.current.onDidChangeCursorPosition((event) => {
          if (!preventChange.current) {
            if (
              event.reason !==
              monacoRef.current.editor.CursorChangeReason.Explicit
            ) {
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
            props.onCursorPositionChange(
              editorRef.current.getValue(),
              event,
              position
            );
          }
        });
    },
    [props.onCursorPositionChange],
    isEditorReady
  );

  // onProcessPaste
  useEffectOnReady(
    () => {
      handlers.current.processPaste = props.onProcessPaste;
    },
    [props.onProcessPaste],
    isEditorReady
  );

  // ----------------------------------------------------------------------------

  // Render

  // Layout on all updates
  React.useEffect(() => {
    if (editorRef.current) {
      editorRef.current.layout();
    }
  });

  // Layout on all resizes (including top level window resizes)
  const handleResize = React.useCallback(() => {
    if (editorRef.current) {
      editorRef.current.layout();
    }
  }, []);

  useResizeDetector({
    targetRef: containerRef,
    onResize: handleResize,
  });

  const className = classnames({
    [props.className]: true, // always append props.className
    [props.classNames.transparent]: props.transparent, // append if transparency enabled
  });

  return (
    <div
      ref={containerRef}
      className={className}
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
  classNames: PropTypes.shape({
    transparent: PropTypes.string,
  }),
  style: stylePropType,
  path: PropTypes.string,
  value: PropTypes.string,
  language: PropTypes.string,
  theme: PropTypes.string,
  transparent: PropTypes.bool,
  editOperations: editOperationsPropType,
  stateDecorations: stateDecorationsPropType,
  editorActions: editorActionsPropType,
  options: PropTypes.object,
  overrideServices: PropTypes.object,
  line: PropTypes.number,
  viewStates: PropTypes.object,
  saveViewState: PropTypes.bool,
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
  classNames: {
    transparent: 'transparent',
  },
  /** @type {React.CSSProperties} */
  style: {},

  /**
   * The path or id associated with this given document instance
   * @type {string}
   */
  path: '',
  /** @type {string?} */
  value: null,
  language: 'javascript',
  /** @type {string?} */
  theme: null,
  transparent: false,

  /** @type {EditOperation[]} */
  editOperations: [],
  /** @type {StateDecoration[]} */
  stateDecorations: [],
  /** @type {EditorAction[]} */
  editorActions: [],

  /** @type {Options} */
  options: {},
  /** @type {OverrideServices} */
  overrideServices: {},

  /** @type {number?} */
  line: null,
  /** @type {Object<string,ViewState>?} */
  viewStates: null,
  saveViewState: true,

  /** @type {(editor: Editor, monaco: Monaco, container: HTMLElement) => void} */
  onInitialize: () => {},
  /** @type {(value: string, event: ModelChangedEvent, position: Position) => void} */
  onChange: () => {},
  /** @type {(value: string) => void} */
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
