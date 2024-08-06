import { KeyEvent } from '@src/hooks/useKeyboard';
import { Sound } from '@src/hooks/useSound';
import useUplodaFile from '@src/hooks/useUplodaFile';
import { getDefaultSynth } from '@src/keyboard/defaults';
import { zBaseSynthSrc } from '@src/synth/config/shared';
import { SoundConfig } from '@src/types';
import { COLOR } from '@src/utils/constants';
import { downloadSound } from '@src/utils/file';
import { useMemo } from 'react';
import IconButton from '../shared/IconButton';
import SectionHeader from '../shared/SectionHeader';
import TimelineBlock from './TimelineBlock';

type SoundLayerControlProps = {
  keyEvent: KeyEvent;
  sound: SoundConfig;
  selectedSynthId?: string;
  onAddLayer: Sound['addLayer'];
  onNameChange: Sound['setName'];
  onLoadSound: (sound: SoundConfig) => void;
  onSelectLayer: (index: string) => void;
  onRemoveLayer: (index: number) => void;
};

export function SoundLayerControl({
  keyEvent,
  sound,
  selectedSynthId,
  onAddLayer,
  onNameChange,
  onLoadSound,
  onSelectLayer,
  onRemoveLayer,
}: SoundLayerControlProps) {
  // TODO: Validation
  const { load } = useUplodaFile(onLoadSound);

  const maxDelayAndDuration = useMemo(
    () =>
      Math.max(
        ...sound.synths.map(
          ({ src }) =>
            zBaseSynthSrc.parse(src.data).delay +
            zBaseSynthSrc.parse(src.data).duration,
        ),
      ),
    [sound.synths],
  );

  return (
    <div
      style={{ background: COLOR.BG }}
      className='flex w-full flex-col items-center space-y-2 p-8 pb-0'
    >
      <SectionHeader
        className='font-bold'
        label={keyEvent === 'down' ? 'downstroke' : 'upstroke'}
      >
        <div className='font-normal'>
          {Math.round(maxDelayAndDuration * 1000)}ms
        </div>
      </SectionHeader>
      <SectionHeader
        labelClassName='w-full'
        label={sound.name}
        onLabelChange={onNameChange}
      >
        <IconButton icon='upload' onClick={load} />
        <IconButton icon='download' onClick={() => downloadSound(sound)} />
        <IconButton
          icon='add'
          onClick={() => {
            const synth = getDefaultSynth();
            onAddLayer(synth);
            onSelectLayer(synth.id);
          }}
        />
      </SectionHeader>
      <div className='flex w-full flex-col'>
        {/* // <div className='fixed bottom-4 left-6 flex items-center rounded-md bg-[rgba(255,255,255,0.5)] px-2 pb-2 backdrop-blur-sm'>
    // </div> */}
        {sound.synths.map((synth) => (
          <TimelineBlock
            key={synth.id}
            synth={synth}
            maxDelayAndDuration={maxDelayAndDuration}
            selected={synth.id === selectedSynthId}
            onClickWatch={() => onSelectLayer(synth.id)}
            onClickListen={() => {}}
            onRemove={() =>
              onRemoveLayer(sound.synths.findIndex((s) => s.id === synth.id))
            }
            removable={sound.synths.length > 1}
          />
        ))}
      </div>
    </div>
  );
}
