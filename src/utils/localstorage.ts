import { KeyboardConfig } from '@src/types';
import { validateKeyboard } from './validator';

const KEY_CURRENT_KEYBOARD_ID = 'current-keyboard-id';

function getKeyboardConfigKey(id: string) {
  return `keyboard-${id}`;
}

function getKeyboardConfig(id: string): KeyboardConfig | null {
  const data = localStorage.getItem(getKeyboardConfigKey(id)) ?? 'null';
  const config = JSON.parse(data);

  if (!validateKeyboard(config)) {
    console.error(`Invalid keyboard config ${data}`);
    return null;
  }

  return config;
}

export function setCurrentKeyboard(config: KeyboardConfig) {
  localStorage.setItem(KEY_CURRENT_KEYBOARD_ID, config.id);
  localStorage.setItem(getKeyboardConfigKey(config.id), JSON.stringify(config));
}

export function getCurrentKeyboard() {
  const currentKeyboardId = localStorage.getItem(KEY_CURRENT_KEYBOARD_ID);
  return currentKeyboardId ? getKeyboardConfig(currentKeyboardId) : null;
}