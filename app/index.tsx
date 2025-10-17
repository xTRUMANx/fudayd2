import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Text } from '@/components/ui/text';
import { Link, Stack } from 'expo-router';
import { ExtendedStackNavigationOptions } from 'expo-router/build/layouts/StackClient';
import { MoonStarIcon, PhoneIcon, SunIcon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { ScrollView, View } from 'react-native';
import {
  UssdService,
  ussdServices,
  generateShortCode,
  OperationParameterValues,
} from '../lib/ussdServices';
import clsx from 'clsx';

const SCREEN_OPTIONS: ExtendedStackNavigationOptions = {
  title: 'Fudayd',
  headerTransparent: true,
  headerRight: () => <ThemeToggle />,
  headerTitleStyle: { fontWeight: 'bold' },
};

export default function Screen() {
  const [currentService, setCurrentService] = React.useState(ussdServices[0]);
  const [currentOperation, setCurrentOperation] = React.useState(ussdServices[0].operations[0]);
  const [parameterValues, setParameterValues] = React.useState<OperationParameterValues>({});

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

  return (
    <>
      <Stack.Screen options={SCREEN_OPTIONS} />
      <ScrollView className="pt-8 bg-background">
        <View className="flex-1 items-center justify-center pt-16">
          <View>
            <Tabs value={currentService.name} onValueChange={selectService}>
              <TabsList>
                {ussdServices.map((service) => (
                  <TabsTrigger key={service.name} value={service.name}>
                    <Text>{service.name}</Text>
                  </TabsTrigger>
                ))}
              </TabsList>
              {ussdServices.map((service) => (
                <TabsContent key={service.name} value={service.name}>
                  <Tabs
                    value={currentOperation.name}
                    onValueChange={(value) => selectOperation(service, value)}>
                    <TabsList>
                      {service.operations.map((operation) => (
                        <TabsTrigger key={operation.name} value={operation.name}>
                          <Text>{operation.name}</Text>
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    {service.operations.map((operation) => (
                      <TabsContent key={operation.name} value={operation.name}>
                        <Text className="text-center">{operation.name} Details</Text>
                        {operation.parameters.map((p) => (
                          <>
                            <Text key={`label-${p.name}`}>{p.name}</Text>
                            <Input
                              key={`input-${p.name}`}
                              placeholder={p.name}
                              className="my-2"
                              defaultValue={parameterValues[p.name] ?? ''}
                              keyboardType="numeric"
                              onChange={(e) => setParameter(p.name, e.nativeEvent.text)}
                            />
                          </>
                        ))}
                      </TabsContent>
                    ))}
                  </Tabs>
                </TabsContent>
              ))}
            </Tabs>
          </View>
          <Separator className={clsx('my-4 w-full', { hidden: !generatedShortCode })} />
          <View className={clsx('w-48', { hidden: !generatedShortCode })}>
            <Text className="text-center">{generatedShortCode || 'N/A'}</Text>
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
            <View>
              <Link href={`tel:${generatedShortCode}`} asChild>
                <Button
                  size="lg"
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
