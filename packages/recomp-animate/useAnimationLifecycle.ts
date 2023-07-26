import * as React from 'react';
import { Easing, easeOutQuart } from './easing';
import { useAnimationFrame } from './useAnimationFrame';
import { clamp } from './util';

type AnimationState<V extends string> = Record<V, number>;
type AnimationStates<S extends string, V extends string> = Record<
  S,
  AnimationState<V>
>;

interface AnimationTransition<T> {
  to: T;
  duration?: number;
  easing?: Easing;
  onComplete?: () => any;
}
type AnimationTransitions<S extends string, T extends S> = Partial<
  Record<S, AnimationTransition<T>[]>
>;

// ----------------------------------------------------------------------------

export const useAnimationLifecycle = <
  S extends string,
  V extends string,
  T extends S
>(
  states: AnimationStates<S, V>,
  transitions?: AnimationTransitions<S, T>
): [AnimationState<V>, (state: S) => any] => {
  const [state, setState] = React.useState('mount');
  const priorStateRef = React.useRef('mount');
  const targetStateRef = React.useRef<string>(null);

  const [value, setValue] = React.useState(() => defaultValue(states));

  const priorRef = React.useRef(value);
  const targetRef = React.useRef<AnimationState<V>>(null);

  const transitionRef = React.useRef<AnimationTransition<T>>(null);

  const alphaRef = React.useRef(0); // value from 0-1 (start to end of anim)
  const easedRef = React.useRef(0); // for inversing (so position value are same)

  // On component mount, move immediately from mount to default
  React.useEffect(() => {
    if (state === 'mount') {
      setState('default');
    }
  }, []);

  const resetRefs = () => {
    priorRef.current = targetRef.current;
    priorStateRef.current = targetStateRef.current;
    targetRef.current = null;
    targetStateRef.current = null;
    transitionRef.current = null;
    alphaRef.current = 0;
    easedRef.current = 0;
  };

  const { begin, cancel, isAnimating } = useAnimationFrame(
    (_timeOffset, deltaTime) => {
      if (state === priorStateRef.current) {
        return false;
      }

      const { easing, duration } = transitionRef.current;

      const alpha = clamp(alphaRef.current + deltaTime / duration);

      alphaRef.current = alpha;

      const eased = easing.forward(alpha);
      easedRef.current = eased;

      const interpolated = interpolateAnimationStates(
        priorRef.current,
        targetRef.current,
        eased
      );

      setValue(interpolated);

      if (stateMatch(priorRef.current, targetRef.current)) {
        return false;
      }

      if (alpha >= 1) {
        transitionRef.current.onComplete?.();
        resetRefs();
        return false;
      }
    }
  );

  React.useEffect(() => {
    // If is already animating, cancel, flip alpha, then resume
    if (isAnimating()) {
      cancel();

      // After flipping priorValueRef with targetValueRef, we need to make sure
      // target starts at the same location, that is (source == target)
      // target == source == targetValue + eased' * (priorValue - targetValue)
      const easedI = extrapolateAnimationStates(
        priorRef.current,
        targetRef.current,
        value
      );

      const { easing } = transitionRef.current;

      const alphaI = easing.inverse(easedI);

      alphaRef.current = alphaI;
      easedRef.current = easedI;

      priorRef.current = targetRef.current;
      targetRef.current = states[state as S];

      priorStateRef.current = targetStateRef.current;
      targetStateRef.current = state;
    } else {
      targetRef.current = states[state as S];
      targetStateRef.current = state;

      transitionRef.current = findTransition(
        priorStateRef.current as T,
        state as T,
        transitions
      );
    }

    if (targetRef.current !== priorRef.current) {
      begin();
    }

    // lastStateRef.current = state;

    () => {
      cancel();
      resetRefs();
    };
  }, [state]);

  if ((states as AnimationStates<'mount', V>).mount) {
  }

  return [value, setState];
};

const defaultValue = <S extends string, V extends string>(
  states: AnimationStates<S, V>
): AnimationState<V> => {
  const mount = (states as AnimationStates<'mount', V>).mount;
  if (mount) {
    return mount;
  }

  const def = (states as AnimationStates<'default', V>).default;
  if (def) {
    return def;
  }

  const keys = Object.keys(states);
  if (keys.length === 0) {
    return {} as AnimationState<V>;
  }

  return (states as Record<string, AnimationState<V>>)[keys[0]];
};

const findTransition = <S extends string, T extends S>(
  from: S,
  to: T,
  transitions?: AnimationTransitions<S, T>
): AnimationTransition<T> => {
  if (transitions) {
    if (transitions[from]) {
      for (const transition of transitions[from]) {
        if (transition.to === to) {
          return { ...defaultTransition, ...transition };
        }
      }
    }
  }

  return { ...defaultTransition, to };
};

const interpolateAnimationStates = <V extends string>(
  from: AnimationState<V>,
  to: AnimationState<V>,
  alpha: number
): AnimationState<V> => {
  const state: Partial<AnimationState<V>> = {};

  for (const key in from) {
    const value = from[key] + alpha * (to[key] - from[key]);
    state[key] = value;
  }

  return state as AnimationState<V>;
};

const extrapolateAnimationStates = <V extends string>(
  from: AnimationState<V>,
  to: AnimationState<V>,
  value: AnimationState<V>
): number => {
  // Here we are trying to figure out eased/alpha from some given value
  // Note: We are only using one key to calculate this, is there a better way?

  const keys: Extract<V, string>[] = [];
  for (const key in from) {
    keys.push(key);
  }

  const fromAmount = from[keys[0]];
  const toAmount = to[keys[0]];
  const valueAmount = value[keys[0]];
  const alpha = (valueAmount - toAmount) / (fromAmount - toAmount);

  return alpha;
};

const stateMatch = <V extends string>(
  from: AnimationState<V>,
  to: AnimationState<V>
) => {
  for (const key in from) {
    if (from[key] !== to[key]) {
      return false;
    }
  }
  return true;
};

const defaultTransition = {
  duration: 1000,
  easing: easeOutQuart,
};
