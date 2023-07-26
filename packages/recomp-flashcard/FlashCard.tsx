import * as React from 'react';

import { classnames } from '@recomp/classnames';
import { propUnion } from '@recomp/props';
import { castDraft, useImmer } from '@recomp/hooks';
import { IconCycle } from './IconCycle';

// ----------------------------------------------------------------------------

/** Model represents a card with some set of sides with a current visible side */
export interface FlashCardModel<T> {
  /** Flashcard data */
  card: T;

  /** Visible side of card */
  side: keyof T;
}

export interface FlashCardStandard {
  front: string;
  back: string;
}

export type FlashCardStandardModel = FlashCardModel<FlashCardStandard>;

// ----------------------------------------------------------------------------

interface FlashCardProps<T> {
  className?: string;
  classNames?: {
    controls?: string;
    badge?: string;
  };
  style?: React.CSSProperties;
  flip?: 'items' | 'cycle' | 'both';
  model: FlashCardModel<T>;
  render?: (side: keyof T, data: T[keyof T]) => React.ReactNode;
  onFlip?: (side: keyof T) => void;
}

// Comma syntax (<T,>) because arrow functions interfere with TSX syntax
export const FlashCard = <T,>(props: FlashCardProps<T>) => {
  props = propUnion(defaultProps, props);

  // Assuming these keys remain in the same order
  const keys = Object.keys(props.model.card) as (keyof T)[];

  const handleBadgeClick = (key: keyof T) => {
    props.onFlip?.(key);
  };

  const handleCycleClick = () => {
    const currentIndex = keys.indexOf(props.model.side);
    const nextIndex = modulo(currentIndex + 1, keys.length);
    props.onFlip?.(keys[nextIndex]);
  };

  return (
    <div className={props.className} style={props.style}>
      <div className={props.classNames.controls}>
        {props.flip === 'items' || props.flip === 'both'
          ? keys.map((key) => {
              return (
                <div
                  key={key.toString()}
                  className={classnames({
                    [props.classNames.badge]: true,
                    active: key === props.model.side,
                  })}
                  onClick={() => handleBadgeClick(key)}
                >
                  {key.toString()}
                </div>
              );
            })
          : null}
        {props.flip === 'cycle' || props.flip === 'both' ? (
          <div
            key={'recomp-flashcard:cycle'}
            className={classnames({
              [props.classNames.badge]: true,
              cycle: true,
            })}
            onClick={handleCycleClick}
          >
            {<IconCycle></IconCycle>}
          </div>
        ) : null}
      </div>
      {props.render?.(props.model.side, props.model.card[props.model.side])}
    </div>
  );
};

const defaultProps: Omit<FlashCardProps<FlashCardStandard>, 'model'> = {
  className: 'recomp-flashcard',
  classNames: {
    controls: 'controls',
    badge: 'badge',
  },
  flip: 'both',
  render: (side, data) => {
    if (!data) return null;

    return <div className={side}>{data}</div>;
  },
};

// ----------------------------------------------------------------------------

const modulo = (n: number, m: number) => {
  return ((n % m) + m) % m;
};

/** State management hook that controls flipping state internally */
export const useFlashCardState = <T,>(defaultModel: FlashCardModel<T>) => {
  const [model, setModel] = useImmer(defaultModel);

  const handleFlip = (key: keyof T) => {
    setModel((model) => {
      model.side = castDraft(key);
    });
  };

  const props = {
    model,
    onFlip: handleFlip,
  };

  return {
    model,
    props,
  };
};
