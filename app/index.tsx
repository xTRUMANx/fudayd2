import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import { Link, Stack } from 'expo-router';
import { ExtendedStackNavigationOptions } from 'expo-router/build/layouts/StackClient';
import {
  CopyCheckIcon,
  CopyIcon,
  EllipsisIcon,
  MoonStarIcon,
  PhoneIcon,
  StarIcon,
  SunIcon,
} from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { ScrollView, View } from 'react-native';
import { generateShortCode, OperationParameterValues, useUssdStore } from '../lib/ussdServices';
import clsx from 'clsx';
import * as Clipboard from 'expo-clipboard';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Chip } from '@/components/chip';

const SCREEN_OPTIONS: ExtendedStackNavigationOptions = {
  title: 'Fudayd',
  headerTransparent: false,
  headerRight: () => <ThemeToggle />,
  headerTitleStyle: { fontWeight: 'bold' },
};

export default function Screen() {
  const ussdServices = useUssdStore((state) => state.ussdServices);
  const currentService = useUssdStore((state) => state.currentService());
  const currentOperation = useUssdStore((state) => state.currentOperation());
  const selectService = useUssdStore((state) => state.setCurrentServiceByName);
  const selectOperation = useUssdStore((state) => state.setCurrentOperationByName);
  const toggleOperationFavorite = useUssdStore((state) => state.toggleOperationFavorite);
  const [parameterValues, setParameterValues] = React.useState<OperationParameterValues>({});
  const [copied, setCopied] = React.useState(false);

  const setParameter = (paramName: string, value: string) => {
    setParameterValues((prev) => ({ ...prev, [paramName]: value }));
  };

  var generatedShortCode = generateShortCode(currentOperation, parameterValues);

  const copyShortCode = async () => {
    await Clipboard.setStringAsync(generatedShortCode || currentOperation.shortCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ScrollView className="bg-background">
      <Stack.Screen options={SCREEN_OPTIONS} />
      <View className="max-w-md mx-auto bg-background px-2">
        <Text className="text-center font-bold">Services</Text>
        <View className="flex-row flex-wrap justify-center gap-1 p-2">
          {ussdServices.map((service) => (
            <Chip
              key={service.name}
              selected={service.name === currentService.name}
              onPress={() => selectService(service.name)}
              text={service.name}
            />
          ))}
        </View>
        <Separator className="w-full" />
        <Text className="text-center font-bold">Operations</Text>
        <View className="flex-row flex-wrap justify-center gap-x-1 gap-y-1 p-2">
          {currentService.operations
            .filter((o) => o.favorite || o.name === currentOperation.name)
            .map((operation) => (
              <Chip
                key={operation.name}
                selected={operation.name === currentOperation.name}
                onPress={() => selectOperation(operation.name)}
                text={operation.name}
              />
            ))}
          <Dialog>
            <DialogTrigger asChild>
              <Button className={clsx('h-6 bg-secondary px-2')} size={'sm'}>
                <Icon as={EllipsisIcon} />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-center">{currentService.name} Operations</DialogTitle>
                <DialogDescription>
                  <View className="flex w-96 flex-col gap-8 pt-4">
                    {currentService.operations.map((operation) => (
                      <View key={operation.name} className="flex flex-row gap-2">
                        <Button
                          variant={'ghost'}
                          onPress={(e) =>
                            toggleOperationFavorite(currentService.name, operation.name)
                          }>
                          <Icon
                            as={StarIcon}
                            className={clsx('size-8', { 'fill-primary': operation.favorite })}
                          />
                        </Button>
                        <Label onPress={() => selectOperation(operation.name)}>
                          {operation.name}
                        </Label>
                      </View>
                    ))}
                  </View>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </View>
        <Separator className="w-full" />
        <Text className="text-center">{currentOperation.name} Details</Text>
        {currentOperation.parameters.map((p) => (
          <View key={p.name}>
            <Text key={`label-${p.name}`}>{p.name}</Text>
            <Input
              key={`input-${p.name}`}
              className="my-2"
              defaultValue={parameterValues[p.name] ?? ''}
              keyboardType="numeric"
              onChange={(e) => setParameter(p.name, e.nativeEvent.text)}
            />
          </View>
        ))}
        <Separator className="w-full" />
        <View className="flex-row items-center justify-center gap-2">
          <Button size={'lg'} variant={'ghost'} onPress={copyShortCode} className="m-0 p-0">
            <Text className="text-center">{generatedShortCode || currentOperation.shortCode}</Text>
            <Icon as={copied ? CopyCheckIcon : CopyIcon} />
          </Button>
        </View>
        <Separator className="mb-2 w-full" />
        <View className="flex-row gap-2">
          <View>
            <Text className="mb-1 text-lg font-bold">Review</Text>
            <View>
              <Text>Service: {currentService.name}</Text>
              <Text>Operation: {currentOperation.name}</Text>
              {currentOperation.parameters.map((p) => (
                <Text key={p.name}>
                  {p.name}: {parameterValues[p.name]}
                </Text>
              ))}
            </View>
          </View>
          <Separator orientation="vertical" />
          <View className="grow items-center justify-center">
            <Link href={`tel:${generatedShortCode}`} asChild>
              <Button size="lg" className="h-32 w-32 rounded-full" disabled={!generatedShortCode}>
                <Text>Dial</Text>
                <Icon as={PhoneIcon} className="text-primary-foreground" />
              </Button>
            </Link>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const THEME_ICONS = {
  light: SunIcon,
  dark: MoonStarIcon,
};

function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  return (
    <Button
      onPressIn={toggleColorScheme}
      size="icon"
      variant="ghost"
      className="ios:size-9 rounded-full web:mx-4">
      <Icon as={THEME_ICONS[colorScheme ?? 'light']} className="size-5" />
    </Button>
  );
}
