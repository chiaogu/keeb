import { SoundConfig } from '@src/types';

function download(fileName: string, data: unknown) {
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
  download(`${sound.name}.json`, sound);
}

export function loadFile(): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.style.display = 'none';
    fileInput.accept = 'application/JSON';

    fileInput.onchange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files ? target.files[0] : null;

      if (file) {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          try {
            const json = JSON.parse(e.target?.result as string);
            resolve(json);
          } catch (error) {
            reject(new Error('File content is not valid JSON.'));
          }
        };
        reader.onerror = () => {
          reject(new Error('Error reading file.'));
        };
        reader.readAsText(file);
      } else {
        resolve(null);
      }

      // Clean up the input element after use
      document.body.removeChild(fileInput);
    };

    document.body.appendChild(fileInput);
    fileInput.click();
  });
}
