import clsx from 'clsx';
import { Button } from './ui/button';
import { Text } from './ui/text';

interface ChipProps {
  selected: boolean;
  onPress: () => void;
  text: string;
}

const Chip: (props: ChipProps) => React.JSX.Element = (props: ChipProps) => (
  <Button
    className={clsx('h-6 px-0', {
      'bg-primary': props.selected,
      'bg-secondary': !props.selected,
    })}
    onPress={props.onPress}>
    <Text
      className={clsx('h-6 px-2 font-semibold', {
        'text-primary': !props.selected,
      })}>
      {props.text}
    </Text>
  </Button>
);

export { Chip };
