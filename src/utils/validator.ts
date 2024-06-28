import { KeyboardConfig } from "@src/types";

export function validateKeyboard(data: unknown): data is KeyboardConfig {
  return true;
}