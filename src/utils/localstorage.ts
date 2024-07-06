import { KeyboardConfig } from '@src/types';
import { validateKeyboard } from './validator';

const KEY_KEYBOARD = 'keyboard';

export function getKeyboardConfig(): KeyboardConfig | null {
  const data = localStorage.getItem(KEY_KEYBOARD) ?? 'null';
  const config = JSON.parse(data);

  if (!validateKeyboard(config)) {
    console.error(`Invalid keyboard config ${data}`);
    return null;
  }

  return config;
}

export function setKeyboardConfig(config: KeyboardConfig) {
  localStorage.setItem(KEY_KEYBOARD, JSON.stringify(config));
}
