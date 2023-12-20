import * as React from 'react';

import { propUnion } from '@recomp/props';
import { Input, InputProps } from './Input';
import { classnames } from '@recomp/classnames';
import {
  determineCursorPositionIn,
  getWidthOfInputAsLabel,
  offsets,
} from '@recomp/size';
import { Pencil } from '@recomp/icons/Pencil';

export type LabelProps = React.DetailedHTMLProps<
  React.LabelHTMLAttributes<HTMLLabelElement>,
  HTMLLabelElement
> & {
  setRef?: (element: HTMLLabelElement) => void;
};

export const Label = (props: LabelProps) => {
  props = propUnion(defaultProps, props);

  const { dangerouslySetInnerHTML: _0, setRef, ...labelProps } = props;

  return <label {...labelProps} ref={setRef} />;
};

const defaultProps: LabelProps = {
  className: 'recomp-label',
};

// ----------------------------------------------------------------------------

export type LabelFieldProps = Omit<LabelProps, 'onChange' | 'onMouseDown'> &
  Pick<InputProps, 'value' | 'onComplete'> & {
    classNames?: {
      editing?: string;
      clickedit?: string; // if label can be clicked to edit
      field?: string;
      input?: string;
    };
    onMouseDown?: React.MouseEventHandler<HTMLElement>;
    setInputRef?: InputProps['setRef'];
  };

/**
 * Editable label which renders an input field when editing, and label when not.
 * Either child must be a string, or value string van be provided
 */
Label.Field = (props: LabelFieldProps) => {
  props = propUnion(defaultFieldProps, props);

  const {
    classNames,
    value,
    onComplete,
    onMouseDown,
    setRef,
    setInputRef,
    ...labelProps
  } = props;

  const defaultInputValue =
    typeof props.children === 'string' || typeof props.children === 'number'
      ? props.children
      : value;

  const inputRef = React.useRef<HTMLInputElement>();

  const [editing, setEditing] = React.useState(false);

  const fieldClassName = classnames({
    [props.classNames.field]: true,
    [props.classNames.editing]: editing,
  });

  const className = classnames({
    [props.className]: true,
    [props.classNames.clickedit]: true,
  });

  // Note: There's a weird issue where calling focus() or even autoFocus on input
  // will trigger onBlur to be called which casues a focus loss

  const handleInputRef = (element: HTMLInputElement) => {
    props.setInputRef?.(element);
    inputRef.current = element;
  };

  const handleInputOnComplete = (text: string) => {
    // Manual handling so field can be set back to unediting
    props.onComplete?.(text);
    setEditing(false);
  };

  const handleLabelMouseDown = (event: React.MouseEvent<HTMLLabelElement>) => {
    // Manually handling mouse down for only label (to go into edit mode)
    props.onMouseDown?.(event);
    setEditing(true);

    const label = event.target as HTMLLabelElement;
    if (label != null) {
      const { x, y } = offsets(
        event.clientX,
        event.clientY,
        label.getBoundingClientRect()
      );

      // This is incredibly strange, but just calling this function is enough to
      // set the cursor position of the input where the label was clicked. Even though
      // the value is not being extracted here
      // This is unbelievable to me... html/js is weird
      determineCursorPositionIn(label, { x, y });
    }
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setEditing(false);
    }
    if (event.key === 'Enter') {
      props.onComplete?.(event.target.value);
      setEditing(false);
    }
  };

  const updateInputWidth = () => {
    if (inputRef.current) {
      let targetWidth = getWidthOfInputAsLabel(inputRef.current);
      targetWidth = Math.max(targetWidth, 8);
      inputRef.current.style.width = `${targetWidth}px`;
    }
  };

  React.useEffect(() => {
    if (editing && inputRef.current != null) {
      updateInputWidth();

      // Using timeout since experiencing weird issues with focusing, onBlur was being
      // called if trying to focus immediately
      setTimeout(() => {
        inputRef.current.focus();
        // The below is commented out because it is currently not needed
        // (see comment above determineCursorPositionIn)
        // inputRef.current.setSelectionRange(cursorPos, cursorPos);
      }, 0);
    }
  }, [editing]);

  const handleInputChange = () => {
    updateInputWidth();
  };

  return (
    <span className={fieldClassName}>
      {!editing ? (
        <Label
          {...labelProps}
          className={className}
          onMouseDown={handleLabelMouseDown}
          setRef={setRef}
        ></Label>
      ) : (
        <Input
          className={classNames.input}
          onComplete={handleInputOnComplete}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          defaultValue={defaultInputValue}
          setRef={handleInputRef}
        />
      )}
      <Pencil></Pencil>
    </span>
  );
};

const defaultFieldProps: LabelFieldProps = {
  className: 'recomp-label',
  classNames: {
    editing: 'editing',
    clickedit: 'clickedit',
    field: 'recomp-field',
    input: 'recomp-input',
  },
};
