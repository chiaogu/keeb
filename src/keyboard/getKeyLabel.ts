const labelMap: Record<string, string> = {
  Escape: 'esc',
  Backspace: 'delete',
  CapsLock: 'caps',
  Tab: 'tab',
  Meta: 'meta',
  Shift: 'shift',
  Enter: 'enter',
  Alt: 'alt',
  Control: 'ctrl',
  Backquote: '`',
  Minus: '-',
  Equal: '=',
  BracketLeft: '[',
  BracketRight: ']',
  Backslash: '\\',
  Semicolon: ';',
  Quote: '\'',
  Comma: ',',
  Period: '.',
  Slash: '/',
  ArrowUp: '↑',
  Space: ' ',
  ArrowLeft: '←',
  ArrowDown: '↓',
  ArrowRight: '→'
};

export default function getKeyCodeLabel(key: string) {
  if (labelMap[key]) return labelMap[key];
  
  if (key.startsWith('Undefined')) return '';
  
  if (key.startsWith('Digit') || key.startsWith('Key')) return key.replace(/(Digit|Key)/g, '');
  
  if (key.endsWith('Left') || key.endsWith('Right')) return labelMap[key.replace(/(Left|Right)/g, '')];
  
  if (key.startsWith('F')) return key.toLowerCase();
  
  return key;
}