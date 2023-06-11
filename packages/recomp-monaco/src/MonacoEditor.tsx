// React component for the monaco editor
// Based on @monaco-editor/react

import * as React from 'react';

import * as util from '@recomp/utility/common';

import { useResizeDetector } from 'react-resize-detector';

import { updatePasteHandler } from './monaco-paste';

import {
  useMount,
  usePostEffect,
  useStateOrProps,
  usePrevious,
  useEffectOnReady,
} from '@recomp/hooks';

import { useMonaco } from './useMonaco';

import * as monaco from 'monaco-editor';

export type Monaco = typeof monaco;
export type Disposable = monaco.IDisposable;
export type Editor = monaco.editor.IStandaloneCodeEditor;
export type ViewState = monaco.editor.ICodeEditorViewState;
export type EditorAction = monaco.editor.IActionDescriptor;
export type Options = monaco.editor.IStandaloneEditorConstructionOptions;
export type OverrideServices = monaco.editor.IEditorOverrideServices;
export type ModelChangedEvent = monaco.editor.IModelChangedEvent;
export type CursorChangedEvent = monaco.editor.ICursorPositionChangedEvent;
export type ModelDecorationOptions = monaco.editor.IModelDecorationOptions;

export interface MonacoEditorProps {
  /**
   * Key is very critical here to create a separate monaco instance when
   * context is switched. Without it, the onChange handler can be sent
   * to the wrong context
   */
  key: React.Key;
  className?: string;
  classNames?: {
    transparent?: string;
  };
  style?: React.CSSProperties;
  path?: string;
  value?: string;
  language?: string;
  theme?: string;
  transparent?: boolean;
  editOperations?: EditOperation[];
  stateDecorations?: StateDecoration[];
  editorActions?: EditorAction[];
  options?: Options;
  overrideServices?: OverrideServices;
  line?: number;
  viewStates?: { [key: string]: ViewState };
  saveViewState?: boolean;
  onInitialize?: (editor: Editor, monaco: Monaco, element: HTMLElement) => any;
  onChange?: (
    text: string,
    event: ModelChangedEvent,
    position: Position
  ) => any;
  onCursorPositionChange?: (
    text: string,
    event: CursorChangedEvent,
    position: Position
  ) => any;
  onDragOver?: () => any;
  onDrop?: () => any;
  onDragLeaveCapture?: () => any;
  onProcessPaste?: (e: any) => any;
  onSetViewStates?: () => any;
  children?: React.ReactNode;
}

export const MonacoEditor = (props: MonacoEditorProps) => {
  props = util.propUnion(defaultProps, props);

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

  const monacoRef: React.MutableRefObject<Monaco> = React.useRef(null);
  const editorRef: React.MutableRefObject<Editor> = React.useRef(null);
  const containerRef: React.MutableRefObject<HTMLDivElement> =
    React.useRef(null);
  const oldDecorations: React.MutableRefObject<string[]> = React.useRef([]);
  const currentActions: React.MutableRefObject<Disposable[]> = React.useRef([]);
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
    processPaste: (_: any) => {},
  });

  const previousPath = usePrevious(props.path);

  // ----------------------------------------------------------------------------

  // Effects

  // Initialize/load monaco on mount
  useMonaco(monacoRef, () => {
    setIsMonacoMounted(true); // trigger react component update
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
    props.key,
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
          editorRef.current.restoreViewState(viewStates[props.path]);
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
            ],
            undefined
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
          model.pushEditOperations([], edits, undefined);
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

  const className = util.classnames({
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

const getOrCreateModel = (
  monaco: Monaco,
  value: string,
  language: string,
  path: string
) => {
  let model = monaco.editor.getModel(monaco.Uri.parse(path));
  if (!model) {
    model = monaco.editor.createModel(value, language, monaco.Uri.parse(path));
  }
  return model;
};

const defaultProps: Omit<MonacoEditorProps, 'key'> = {
  className: 'recomp-monaco container',
  classNames: {
    transparent: 'transparent',
  },
  path: '',
  value: null,
  language: 'javascript',
  theme: null,
  transparent: false,
  editOperations: [],
  stateDecorations: [],
  editorActions: [],
  line: null,
  viewStates: null,
  saveViewState: true,
  onInitialize: () => {},
  onChange: () => {},
  onCursorPositionChange: () => {},
  onProcessPaste: () => {},
  onDragOver: () => {},
  onDrop: () => {},
  onDragLeaveCapture: () => {},
  onSetViewStates: () => {},
};

export interface Position {
  line: number;
  column: number;
}

export interface EditOperation {
  range: {
    start: Position;
    end: Position;
  };
  text: string;
}

export interface StateDecoration {
  range: {
    start: Position;
    end: Position;
  };
  options: ModelDecorationOptions;
}
