const width: Record<string, number> = {
  Tab: 1.5,
  CapsLock: 1.75,
  ShiftLeft: 2.25,
  ControlLeft: 1.25,
  AltLeft: 1.25,
  MetaLeft: 1.25,
  Space: 6.25,
  Backspace: 2,
  Backslash: 1.5,
  Enter: 2.25,
  ShiftRight: 1.75
};

export default function getKeyWidth(key: string) {
  return width[key] ?? 1;
}