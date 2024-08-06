import { KeyEvent } from '@src/hooks/useKeyboard';
import { useEffect, useMemo, useState } from 'react';
import { useMainContext } from '../shared/MainContext';
import SynthControl from '../synth/SynthControl';
import { SoundLayerControl } from './SoundLayerControl';

const keyEvents: KeyEvent[] = ['down', 'up'];

export default function SoundControl() {
  const { keyboard, setScreenMeterChannel } = useMainContext();
  const [selectedSynthId, setSelectedSynthId] = useState<string>();

  const { selectedSound, selectedSynth, keyEvent, selectedSynthIndex } =
    useMemo(() => {
      for (const keyEvent of keyEvents) {
        const sound = keyboard[keyEvent].sound;
        const selectedSynthIndex = sound.synths.findIndex(
          ({ id }) => id === selectedSynthId,
        );
        if (selectedSynthIndex > -1) {
          return {
            keyEvent,
            selectedSound: sound,
            selectedSynth: sound.synths[selectedSynthIndex],
            selectedSynthIndex,
          };
        }
      }

      return {};
    }, [keyboard, selectedSynthId]);

  useEffect(() => {
    if (keyEvent) setScreenMeterChannel(keyEvent);
  }, [keyEvent, setScreenMeterChannel]);

  return (
    <div className='flex w-full max-w-[500px] flex-col items-center space-y-5 overflow-x-visible'>
      {keyEvents.map((event) => {
        const { sound } = keyboard[event];
        return (
          <SoundLayerControl
            key={event}
            keyEvent={event}
            sound={sound}
            selectedSynthId={selectedSynth?.id}
            onAddLayer={sound.addLayer}
            onNameChange={sound.setName}
            onLoadSound={sound.loadConfig}
            onSelectLayer={setSelectedSynthId}
            onRemoveLayer={(index) => {
              sound.removeLayer(index);
              if (index === selectedSynthIndex) {
                setSelectedSynthId(
                  sound.synths[index === 0 ? 1 : selectedSynthIndex - 1].id,
                );
              }
            }}
          />
        );
      })}
      {selectedSynth && (
        <SynthControl
          soundName={selectedSound.name}
          key={selectedSynth.id}
          synth={selectedSynth}
          onSrcChange={(src) => {
            selectedSound.setSrcState(selectedSynthIndex, src);
          }}
          onFxChange={(fxIndex, fx) =>
            selectedSound.setFxState(selectedSynthIndex, fxIndex, fx)
          }
          onRemoveFx={(fxIndex) => {
            selectedSound.removeFx(selectedSynthIndex, fxIndex);
          }}
          onAddFx={(fxIndex, fxType) =>
            selectedSound.addFx(selectedSynthIndex, fxIndex, fxType)
          }
          onNameChange={(name) => {
            selectedSound.updateLayer(selectedSynthIndex, { name });
          }}
        />
      )}
    </div>
  );
}
