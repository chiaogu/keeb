import { KeyboardConfig } from '@src/types';
import { validateKeyboard } from './validator';

const KEY_CURRENT_KEYBOARD_ID = 'current-keyboard-id';
const KEY_KEYBOARD_ID_PREFIX = 'keyboard-';

function getKeyboardConfigKey(id: string) {
  return `${KEY_KEYBOARD_ID_PREFIX}${id}`;
}

export function getKeyboardConfig(id: string): KeyboardConfig | null {
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

export function getKeyboardPresets() {
  const keyboardIds: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(KEY_KEYBOARD_ID_PREFIX)) {
      keyboardIds.push(key.split(KEY_KEYBOARD_ID_PREFIX)[1]);
    }
  }
  return keyboardIds;
}