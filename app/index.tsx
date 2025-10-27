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
import {
  UssdService,
  generateShortCode,
  OperationParameterValues,
  getUssdServices,
} from '../lib/ussdServices';
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

const SCREEN_OPTIONS: ExtendedStackNavigationOptions = {
  title: 'Fudayd',
  headerTransparent: true,
  headerRight: () => <ThemeToggle />,
  headerTitleStyle: { fontWeight: 'bold' },
};

export default function Screen() {
  const [ussdServices, _] = React.useState(getUssdServices());
  const [currentService, setCurrentService] = React.useState(ussdServices[0]);
  const [currentOperation, setCurrentOperation] = React.useState(ussdServices[0].operations[0]);
  const [parameterValues, setParameterValues] = React.useState<OperationParameterValues>({});
  const [copied, setCopied] = React.useState(false);


  const selectService = (serviceName: string) => {
    const service = ussdServices.find((s) => s.name === serviceName)!;
    setCurrentService(service);
    setCurrentOperation(service.operations[0]);
  };

  const selectOperation = (service: UssdService, operationName: string) => {
    const operation = service.operations.find((o) => o.name === operationName)!;
    setCurrentOperation(operation);
  };

  const setParameter = (paramName: string, value: string) => {
    setParameterValues((prev) => ({ ...prev, [paramName]: value }));
  };

  var generatedShortCode = generateShortCode(currentOperation, parameterValues);

  const copyShortCode = async () => {
    await Clipboard.setStringAsync(generatedShortCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Stack.Screen options={SCREEN_OPTIONS} />
      <ScrollView className="items-center justify-start">
        <View className="w-sm px-2 pt-16">
          <View className="flex-row flex-wrap justify-center gap-2">
            {ussdServices.map((service) => (
              <Button
                key={service.name}
                className="h-6"
                size={'sm'}
                onPress={() => selectService(service.name)}>
                <Text key={service.name}>{service.name}</Text>
              </Button>
            ))}
          </View>
          <Separator className="w-full" />
          <View className="flex-row flex-wrap justify-center gap-x-1 gap-y-1 p-2">
            {currentService.operations
              .filter((o) => o.favorite || o.name === currentOperation.name)
              .map((operation) => (
                <Button
                  key={operation.name}
                  className="h-6"
                  size={'sm'}
                  onPress={() => selectOperation(currentService, operation.name)}>
                  <Text>{operation.name}</Text>
                </Button>
              ))}
            <Dialog>
              <DialogTrigger asChild>
                <Button className="h-6" size={'sm'}>
                  <Icon as={EllipsisIcon} className="text-primary-foreground" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-center">
                    {currentService.name} Operations
                  </DialogTitle>
                  <DialogDescription>
                    <View className="flex w-96 flex-col gap-8 pt-4">
                      {currentService.operations.map((operation) => (
                        <View key={operation.name} className="flex flex-row gap-2">
                          <Icon
                            as={StarIcon}
                            className={clsx('size-8', { 'fill-primary': operation.favorite })}
                            onPress={() => alert('Not implemented')}
                          />
                          <Label onPress={() => selectOperation(currentService, operation.name)}>
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
          <Separator className={clsx('my-4 w-full', { hidden: !generatedShortCode })} />
          <View
            className={clsx('flex-row items-center justify-center gap-2', {
              hidden: !generatedShortCode,
            })}>
            <Text className="text-center">{generatedShortCode || 'N/A'}</Text>
            <Button variant={'ghost'} onPress={copyShortCode}>
              <Icon as={copied ? CopyCheckIcon : CopyIcon} />
            </Button>
          </View>
          <Separator className="my-4 w-full" />
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
            <View className="grow items-center">
              <Link href={`tel:${generatedShortCode}`} asChild>
                <Button
                  size="lg"
                  className="h-16 w-full rounded-full"
                  disabled={!generatedShortCode}
                  onPress={() => {
                    console.log('Dialing', generatedShortCode);
                  }}>
                  <Text>Dial</Text>
                  <Icon as={PhoneIcon} className="text-primary-foreground" />
                </Button>
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
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
