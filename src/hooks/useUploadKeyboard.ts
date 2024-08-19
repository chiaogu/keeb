import { replaceAllId } from '@src/keyboard/keySoundModifier';
import { KeyboardConfig, ModifierLayer, SoundConfig } from '@src/types';
import { loadSoundConfig } from './useUploadSound';
import useUplodaFile from './useUplodaFile';

function loadSound(config: SoundConfig) {
  const idMap: Record<string, string> = {};
  const newConfig = loadSoundConfig(config);

  config.synths.forEach(({ id, src, fxs }, synthIndex) => {
    idMap[id] = newConfig.synths[synthIndex].id;
    idMap[src.id] = newConfig.synths[synthIndex].src.id;
    fxs.forEach((fx, fxIndex) => {
      idMap[fx.id] = newConfig.synths[synthIndex].fxs[fxIndex].id;
    });
  });

  return { config: newConfig, idMap };
}

function loadModifiers(
  modifiers: ModifierLayer[],
  idMap: Record<string, string>,
) {
  modifiers.forEach(({ keys, ...layer }) => {
    Object.values(keys).forEach((soundModifier) => {
      replaceAllId(soundModifier, idMap);
    });
    if (layer.type === 'random') {
      replaceAllId(layer.config, idMap);
    }
  });
  return modifiers;
}

export default function useUploadKeyboard(
  onLoad: (data: KeyboardConfig) => void,
  regenIds: boolean = true,
) {
  const { load } = useUplodaFile((data: KeyboardConfig) => {
    if (regenIds === false) {
      onLoad(data);
      return;
    }
    
    const up = loadSound(data.sound.up.config);
    const down = loadSound(data.sound.down.config);

    onLoad({
      ...data,
      sound: {
        ...data.sound,
        up: {
          ...data.sound.up,
          config: up.config,
        },
        down: {
          ...data.sound.down,
          config: down.config,
        },
        modifiers: loadModifiers(data.sound.modifiers, {
          ...up.idMap,
          ...down.idMap,
        }),
      },
    });
  });

  return load;
}
