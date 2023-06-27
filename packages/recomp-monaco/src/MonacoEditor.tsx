// React component for the monaco editor
// Based on @monaco-editor/react

import * as React from 'react';

import * as util from '@recomp/utility/common';

import { useResizeDetector } from 'react-resize-detector';

import { updatePasteHandler } from './monaco-paste';

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
export type ModelContentChangedEvent = monaco.editor.IModelContentChangedEvent;
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
  editorActions?: EditorAction[];
  options?: Options;
  overrideServices?: OverrideServices;
  /**
   * Called immediately after editor and model are created but before this component
   * perform some initialization methods. Use `onReady` instead for
   * post-initialization callback
   */
  onInitialize?: (editor: Editor, monaco: Monaco, element: HTMLElement) => void;
  onReady?: (editor: Editor, monaco: Monaco, element: HTMLElement) => void;
  onChange?: (
    text: string,
    event: ModelContentChangedEvent,
    position: Position
  ) => void;
  onDispose?: (editor: Editor) => void;
  onCursorPositionChange?: (
    text: string,
    event: CursorChangedEvent,
    position: Position
  ) => void;
  onDragOver?: () => void;
  onDrop?: () => void;
  onDragLeaveCapture?: () => void;
  onProcessPaste?: (e: any) => void;
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

  // Fields

  const monacoRef: React.MutableRefObject<Monaco> = React.useRef(null);
  const editorRef: React.MutableRefObject<Editor> = React.useRef(null);
  const containerRef: React.MutableRefObject<HTMLDivElement> =
    React.useRef(null);
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
        props.value,
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

      monacoRef.current.editor.setTheme(props.theme);

      props.onInitialize?.(
        editorRef.current,
        monacoRef.current,
        containerRef.current
      );

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
    props.theme,
  ]);

  // Handle disposing editor on unmount
  React.useEffect(() => {
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

        // If save view state is needed before dispose
        props.onDispose?.(editorRef.current);

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
  }, []);

  // ----------------------------------------------------------------------------

  // Editor ready effects
  // These effects will be applied right after the editor is ready OR when props
  // change. This is different than the "post editor" effects below since these
  // types of effects are not handled during editor creation

  // Update actions
  // Editor actions are tied to the passed props. Meaning they are added when
  // new actions are added and removed when they are no longer passed through
  // the component.
  useEffectOnReady(
    () => {
      // Remove all previous editor actions
      for (let i = 0; i < currentActions.current.length; i++) {
        currentActions.current[i].dispose();
      }
      currentActions.current = [];

      // Add new actions
      if (props.editorActions) {
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

  // ----------------------------------------------------------------------------

  // Post editor effects
  // These effects are only applied after certains props change
  // POST editor creation. Since otherwise, the editor will already
  // have these values set on creation (value, lang, theme, etc)

  // Update options if modified
  usePostEffect(
    () => {
      editorRef.current.updateOptions(props.options);
    },
    [props.options],
    isEditorReady
  );

  // onChange
  // I moved this effect before the "edit text" effect below. This allows to set
  // the change listener before content is modified. Which is very critical when
  // modifying props in react component
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
            props.onChange?.(editorRef.current.getValue(), event, position);
          }
        });
    },
    [props.onChange],
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
      } else if (props.value !== editorRef.current.getValue()) {
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
          ],
          undefined
        );
        editorRef.current.pushUndoStop(); //TODO: should this be a pop? find out
        preventChange.current = false;
      }
    },
    [props.value],
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

  // onReady
  useEffectOnReady(
    () => {
      props.onReady?.(
        editorRef.current,
        monacoRef.current,
        containerRef.current
      );
    },
    [],
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
            props.onCursorPositionChange?.(
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
  path?: string
) => {
  let model = null;
  const uri = path ? monaco.Uri.parse(path) : undefined;
  if (path) {
    model = monaco.editor.getModel(uri);
  }
  if (!model) {
    model = monaco.editor.createModel(value, language, uri);
  }
  return model;
};

const defaultProps: Omit<MonacoEditorProps, 'key'> = {
  className: 'recomp-monaco container',
  classNames: {
    transparent: 'transparent',
  },
  path: null,
  value: null,
  language: 'javascript',
  theme: null,
  transparent: false,
};

export interface Position {
  line: number;
  column: number;
}

export interface Range {
  start: Position;
  end: Position;
}

export interface EditOperation {
  range: Range;
  text: string;
}

export interface StateDecoration {
  range: Range;
  options: ModelDecorationOptions;
}

export const toMonacoRange = (monaco: Monaco, range: Range) => {
  const mappedRange = new monaco.Range(
    range.start.line,
    range.start.column,
    range.end.line,
    range.end.column
  );
  return mappedRange;
};

export const fromMonacoRange = (range: monaco.IRange): Range => {
  return {
    start: {
      line: range.startLineNumber,
      column: range.startColumn,
    },
    end: {
      line: range.endLineNumber,
      column: range.endColumn,
    },
  };
};

export const toMonacoOperations = (
  monaco: Monaco,
  editOperations: EditOperation[]
) => {
  const mappedEditOperations = editOperations.map(({ range, text }) => {
    return {
      range: toMonacoRange(monaco, range),
      text,
    };
  });
  return mappedEditOperations;
};

export const toMonacoDecorations = (
  monaco: Monaco,
  decorations: StateDecoration[]
) => {
  const mappedDecorations = decorations.map(({ range, options }) => {
    return {
      range: toMonacoRange(monaco, range),
      options,
    };
  });
  return mappedDecorations;
};

// ----------------------------------------------------------------------------

/** Use effect after initial mount */
const usePostEffect = (effect: () => any, deps: any, applyChanges = true) => {
  const isInitialMount = React.useRef(true);

  if (isInitialMount.current || !applyChanges) {
    effect = () => {
      isInitialMount.current = false;
    };
  }

  React.useEffect(effect, deps);
};

/** Use this effect only when isReady flag is true */
const useEffectOnReady = (
  effect: () => any,
  deps: any[] = [],
  isReady: boolean = false
) => {
  const wrappedEffect = React.useCallback(() => {
    if (isReady) {
      return effect();
    }
  }, [isReady, effect]);

  const dependencies = [...deps, isReady];

  React.useEffect(wrappedEffect, dependencies);
};
