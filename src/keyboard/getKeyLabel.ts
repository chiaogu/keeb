const labelMap: Record<string, string> = {
  Escape: 'Esc',
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
  
  if (key.startsWith('Digit') || key.startsWith('Key')) return key.replace(/(Digit|Key)/g, '');
  
  if (key.endsWith('Left') || key.endsWith('Right')) return key.replace(/(Left|Right)/g, '').replace(/Control/g, 'Ctrl');
  
  return key;
}