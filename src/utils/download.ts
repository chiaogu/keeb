import { SoundConfig } from '@src/types';
import day from 'dayjs';

export default function download(fileName: string, data: unknown) {
  const jsonData = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonData], { type: 'application/json' });

  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function downloadSound(sound: SoundConfig) {
  download(`${sound.name}-${day().format('YYYYMMDDHHmmss')}.json`, sound);
}
