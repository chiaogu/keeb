import Keyboard, { KeyboardProps } from '../Keyboard';
import { useModiferContext } from './ModifierContext';

export default function ModifierKeyboard(props: KeyboardProps) {
  const { triggerUp, triggerDown } = useModiferContext();
  return (
    <Keyboard
      {...props}
      onRelease={(key) => {
        triggerUp(key);
        props.onRelease?.(key);
      }}
      onPress={(key) => {
        triggerDown(key);
        props.onPress?.(key);
      }}
    />
  );
}
