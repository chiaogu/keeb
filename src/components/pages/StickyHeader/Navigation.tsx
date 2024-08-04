import SliderSelect from '@src/components/shared/SliderSelect';
import { get } from 'lodash-es';
import { useCallback, useMemo, useState } from 'react';

const NAV = {
  '/': {
    keyboard: {
      sound: {
        synth: null,
        tweaks: null,
      },
      visual: {
        keycaps: null,
        light: null,
      },
    },
    presets: null,
    settings: null,
  },
};

const BACK = {
  value: 'back',
  label: (
    <span className='material-symbols-outlined -mx-2'>chevron_backward</span>
  ),
};

export default function Navigation() {
  const [path, setPath] = useState(['/', 'keyboard', 'sound', 'synth']);
  const [prevPath, setPrevPath] = useState<string[]>([]);

  const direction = useMemo(
    () => (prevPath.length > path.length ? 'up' : prevPath.length < path.length ? 'down' : null),
    [path.length, prevPath.length],
  );
  
  console.log(direction);

  const label = useMemo(() => {
    const result = path[path.length - 2] ?? '';
    return result === '/' ? '' : result;
  }, [path]);

  const options = useMemo(
    () => [
      ...(path.length > 2 ? [BACK] : []),
      ...Object.keys(get(NAV, path.slice(0, path.length - 1)) ?? {}),
    ],
    [path],
  );

  const handleChange = useCallback((value: string) => {
    setPath((currentPath) => [
      ...currentPath.slice(0, currentPath.length - 1),
      value,
    ]);
  }, []);

  const handleRelease = useCallback(() => {
    setPrevPath(path);

    if (path[path.length - 1] === BACK.value) {
      setPath(path.slice(0, path.length - 1));
    }

    const children = get(NAV, path);
    if (children != null) {
      setPath([...path, BACK.value]);
    }
  }, [path]);

  return (
    <div className='h-14 w-full px-4 py-3'>
      <SliderSelect
        label={label}
        options={options}
        value={path[path.length - 1]}
        onChange={handleChange}
        onRelease={handleRelease}
        sensitivity={2}
        showOptions
        bgColor='transparent'
        bgStyle={{
          color: 'white',
        }}
        indicatorStyle={{ background: 'white', mixBlendMode: 'difference' }}
      />
    </div>
  );
}
