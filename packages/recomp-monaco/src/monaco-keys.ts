// Monaco key codes and binding utilities

import * as monaco from 'monaco-editor';

export const convertKeyBindings = (binding: string) => {
  binding = binding.toLowerCase();

  const result = [];
  const items = binding.split(' ');
  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    let current = 0;

    const tokens = item.split('+');
    if (tokens.length < 1) {
      throw new Error('Invalid key binding: ' + item);
    }
    if (!codeMap[tokens[tokens.length - 1]]) {
      throw new Error('Invalid key binding, last item must be code: ' + item);
    }
    for (let j = 0; j < tokens.length; j++) {
      const token = tokens[j];
      const value = convertToken(token);
      current |= value;
    }

    result.push(current);
  }

  if (result.length > 1) {
    return [monaco.KeyMod.chord(result[0], result[1])];
  }

  return result;
};

const convertToken = (item: string) => {
  if (modMap[item]) {
    return modMap[item];
  }
  if (codeMap[item]) {
    return codeMap[item];
  }
  throw new Error(`Could not convert to monaco key binding for: ${item}`);
};

export const modMap: { [key: string]: monaco.KeyCode } = {
  alt: monaco.KeyMod.Alt,
  ctrl: monaco.KeyMod.CtrlCmd,
  shift: monaco.KeyMod.Shift,
};

export const codeMap: { [key: string]: monaco.KeyCode } = {
  dependsonkblayout: monaco.KeyCode.DependsOnKbLayout,
  unknown: monaco.KeyCode.Unknown,
  backspace: monaco.KeyCode.Backspace,
  tab: monaco.KeyCode.Tab,
  enter: monaco.KeyCode.Enter,
  // TODO: When would these be used as keycodes and not mods?
  // shift: monaco.KeyCode.Shift,
  // ctrl: monaco.KeyCode.Ctrl,
  // alt: monaco.KeyCode.Alt,
  pausebreak: monaco.KeyCode.PauseBreak,
  capslock: monaco.KeyCode.CapsLock,
  escape: monaco.KeyCode.Escape,
  space: monaco.KeyCode.Space,
  pageup: monaco.KeyCode.PageUp,
  pagedown: monaco.KeyCode.PageDown,
  end: monaco.KeyCode.End,
  home: monaco.KeyCode.Home,
  left: monaco.KeyCode.LeftArrow,
  up: monaco.KeyCode.UpArrow,
  right: monaco.KeyCode.RightArrow,
  down: monaco.KeyCode.DownArrow,
  insert: monaco.KeyCode.Insert,
  delete: monaco.KeyCode.Delete,
  0: monaco.KeyCode.Digit0,
  1: monaco.KeyCode.Digit1,
  2: monaco.KeyCode.Digit2,
  3: monaco.KeyCode.Digit3,
  4: monaco.KeyCode.Digit4,
  5: monaco.KeyCode.Digit5,
  6: monaco.KeyCode.Digit6,
  7: monaco.KeyCode.Digit7,
  8: monaco.KeyCode.Digit8,
  9: monaco.KeyCode.Digit9,
  a: monaco.KeyCode.KeyA,
  b: monaco.KeyCode.KeyB,
  c: monaco.KeyCode.KeyC,
  d: monaco.KeyCode.KeyD,
  e: monaco.KeyCode.KeyE,
  f: monaco.KeyCode.KeyF,
  g: monaco.KeyCode.KeyG,
  h: monaco.KeyCode.KeyH,
  i: monaco.KeyCode.KeyI,
  j: monaco.KeyCode.KeyJ,
  k: monaco.KeyCode.KeyK,
  l: monaco.KeyCode.KeyL,
  m: monaco.KeyCode.KeyM,
  n: monaco.KeyCode.KeyN,
  o: monaco.KeyCode.KeyO,
  p: monaco.KeyCode.KeyP,
  q: monaco.KeyCode.KeyQ,
  r: monaco.KeyCode.KeyR,
  s: monaco.KeyCode.KeyS,
  t: monaco.KeyCode.KeyT,
  u: monaco.KeyCode.KeyU,
  v: monaco.KeyCode.KeyV,
  w: monaco.KeyCode.KeyW,
  x: monaco.KeyCode.KeyX,
  y: monaco.KeyCode.KeyY,
  z: monaco.KeyCode.KeyZ,
  meta: monaco.KeyCode.Meta,
  contextmenu: monaco.KeyCode.ContextMenu,
  f1: monaco.KeyCode.F1,
  f2: monaco.KeyCode.F2,
  f3: monaco.KeyCode.F3,
  f4: monaco.KeyCode.F4,
  f5: monaco.KeyCode.F5,
  f6: monaco.KeyCode.F6,
  f7: monaco.KeyCode.F7,
  f8: monaco.KeyCode.F8,
  f9: monaco.KeyCode.F9,
  f10: monaco.KeyCode.F10,
  f11: monaco.KeyCode.F11,
  f12: monaco.KeyCode.F12,
  f13: monaco.KeyCode.F13,
  f14: monaco.KeyCode.F14,
  f15: monaco.KeyCode.F15,
  f16: monaco.KeyCode.F16,
  f17: monaco.KeyCode.F17,
  f18: monaco.KeyCode.F18,
  f19: monaco.KeyCode.F19,
  numlock: monaco.KeyCode.NumLock,
  scrolllock: monaco.KeyCode.ScrollLock,
  semicolon: monaco.KeyCode.Semicolon,
  equal: monaco.KeyCode.Equal,
  comma: monaco.KeyCode.Comma,
  minus: monaco.KeyCode.Minus,
  period: monaco.KeyCode.Period,
  slash: monaco.KeyCode.Slash,
  backquote: monaco.KeyCode.Backquote,
  bracketleft: monaco.KeyCode.BracketLeft,
  backslash: monaco.KeyCode.Backslash,
  bracketright: monaco.KeyCode.BracketRight,
  quote: monaco.KeyCode.Quote,
  oem_8: monaco.KeyCode.OEM_8,
  numpad0: monaco.KeyCode.Numpad0,
  numpad1: monaco.KeyCode.Numpad1,
  numpad2: monaco.KeyCode.Numpad2,
  numpad3: monaco.KeyCode.Numpad3,
  numpad4: monaco.KeyCode.Numpad4,
  numpad5: monaco.KeyCode.Numpad5,
  numpad6: monaco.KeyCode.Numpad6,
  numpad7: monaco.KeyCode.Numpad7,
  numpad8: monaco.KeyCode.Numpad8,
  numpad9: monaco.KeyCode.Numpad9,
  numpadmultiply: monaco.KeyCode.NumpadMultiply,
  numpadadd: monaco.KeyCode.NumpadAdd,
  numpadseparator: monaco.KeyCode.NUMPAD_SEPARATOR,
  numpadsubtract: monaco.KeyCode.NumpadSubtract,
  numpaddecimal: monaco.KeyCode.NumpadDecimal,
  numpaddivide: monaco.KeyCode.NumpadDivide,
  in_composition: monaco.KeyCode.KEY_IN_COMPOSITION,
  abnt_c1: monaco.KeyCode.ABNT_C1,
  abnt_c2: monaco.KeyCode.ABNT_C2,
  max_value: monaco.KeyCode.MAX_VALUE,
};
