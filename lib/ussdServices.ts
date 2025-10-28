import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export type UssdService = {
  name: string;
  operations: USSDServiceOpearation[];
};

export type USSDServiceOpearation = {
  name: string;
  shortCode: string;
  favorite: boolean;
  parameters: { name: string }[];
};

export type OperationParameterValues = Record<string, string>;

export const generateShortCode = (
  operation: USSDServiceOpearation,
  parameters: OperationParameterValues
) => {
  if (operation.parameters.length > Object.keys(parameters).length) {
    return '';
  }

  let shortCode = operation.shortCode;

  for (const param of operation.parameters) {
    const value = parameters[param.name] || '';

    if (!value) {
      return '';
    }

    shortCode = shortCode.replace(`{${param.name}}`, value);
  }

  return shortCode;
};

const ussdServices: UssdService[] = [
  {
    name: 'Zaad USD',
    operations: [
      {
        name: 'Send Money',
        shortCode: '*880*{Recipient}*{Amount}#',
        favorite: true,
        parameters: [{ name: 'Recipient' }, { name: 'Amount' }],
      },
      {
        name: 'Merchant Payment',
        shortCode: '*883*{Merchant}*{Amount}#',
        favorite: true,
        parameters: [{ name: 'Merchant' }, { name: 'Amount' }],
      },
      {
        name: 'Account Deposit',
        shortCode: '*889*{Account}*{Amount}#',
        favorite: false,
        parameters: [{ name: 'Account' }, { name: 'Amount' }],
      },
      {
        name: 'Exchange Money',
        shortCode: '*377*{Exchanger}*{Amount}#',
        favorite: true,
        parameters: [{ name: 'Exchanger' }, { name: 'Amount' }],
      },
      {
        name: 'Withdraw Money',
        shortCode: '*884*{Cashier}*{Amount}#',
        favorite: true,
        parameters: [{ name: 'Cashier' }, { name: 'Amount' }],
      },
      {
        name: 'Mobile Topup',
        shortCode: '*881*{Phone}*{Amount}#',
        favorite: true,
        parameters: [{ name: 'Phone' }, { name: 'Amount' }],
      },
    ],
  },
  {
    name: 'Zaad SLSH',
    operations: [
      {
        name: 'Send Money',
        shortCode: '*220*{Recipient}*{Amount}#',
        favorite: true,
        parameters: [{ name: 'Recipient' }, { name: 'Amount' }],
      },
      {
        name: 'Merchant Payment',
        shortCode: '*223*{Merchant}*{Amount}#',
        favorite: true,
        parameters: [{ name: 'Merchant' }, { name: 'Amount' }],
      },
      {
        name: 'Exchange Money',
        shortCode: '*277*{Exchanger}*{Amount}#',
        favorite: false,
        parameters: [{ name: 'Exchanger' }, { name: 'Amount' }],
      },
      {
        name: 'Withdraw Money',
        shortCode: '*224*{Cashier}*{Amount}#',
        favorite: false,
        parameters: [{ name: 'Cashier' }, { name: 'Amount' }],
      },
      {
        name: 'Mobile Topup',
        shortCode: '*221*{Phone}*{Amount}#',
        favorite: true,
        parameters: [{ name: 'Phone' }, { name: 'Amount' }],
      },
    ],
  },
  {
    name: 'eDahab USD',
    operations: [
      {
        name: 'Send Money',
        shortCode: '*110*{Recipient}*{Amount}#',
        favorite: true,
        parameters: [{ name: 'Recipient' }, { name: 'Amount' }],
      },
      {
        name: 'Merchant Payment',
        shortCode: '*113*{Merchant}*{Amount}#',
        favorite: true,
        parameters: [{ name: 'Merchant' }, { name: 'Amount' }],
      },
      {
        name: 'Account Deposit',
        shortCode: '*799*{Account}*{Amount}#',
        favorite: false,
        parameters: [{ name: 'Account' }, { name: 'Amount' }],
      },
      {
        name: 'Exchange Money',
        shortCode: '*109*{Exchanger}*{Amount}#',
        favorite: true,
        parameters: [{ name: 'Exchanger' }, { name: 'Amount' }],
      },
      {
        name: 'Withdraw Money',
        shortCode: '*115*{Cashier}*{Amount}#',
        favorite: true,
        parameters: [{ name: 'Cashier' }, { name: 'Amount' }],
      },
      {
        name: 'Mobile Topup',
        shortCode: '*114*{Phone}*{Amount}#',
        favorite: true,
        parameters: [{ name: 'Phone' }, { name: 'Amount' }],
      },
    ],
  },
  {
    name: 'eDahab SLSH',
    operations: [
      {
        name: 'Send Money',
        shortCode: '*770*{Recipient}*{Amount}#',
        favorite: true,
        parameters: [{ name: 'Recipient' }, { name: 'Amount' }],
      },
      {
        name: 'Merchant Payment',
        shortCode: '*773*{Merchant}*{Amount}#',
        favorite: true,
        parameters: [{ name: 'Merchant' }, { name: 'Amount' }],
      },
      {
        name: 'Account Deposit',
        shortCode: '*799*{Account}*{Amount}#',
        favorite: false,
        parameters: [{ name: 'Account' }, { name: 'Amount' }],
      },
      {
        name: 'Exchange Money',
        shortCode: '*119*{Exchanger}*{Amount}#',
        favorite: false,
        parameters: [{ name: 'Exchanger' }, { name: 'Amount' }],
      },
      {
        name: 'Withdraw Money',
        shortCode: '*775*{Cashier}*{Amount}#',
        favorite: false,
        parameters: [{ name: 'Cashier' }, { name: 'Amount' }],
      },
      {
        name: 'Mobile Topup',
        shortCode: '*774*{Phone}*{Amount}#',
        favorite: true,
        parameters: [{ name: 'Phone' }, { name: 'Amount' }],
      },
    ],
  },
];

export interface UssdStoreState {
  ussdServices: UssdService[];
  currentServiceIndex: number;
  currentService: () => UssdService;
  currentOperationIndex: number;
  currentOperation: () => USSDServiceOpearation;
}

export interface UssdStoreActions {
  setCurrentServiceByName: (serviceName: string) => void;
  setCurrentOperationByName: (operationName: string) => void;
  toggleOperationFavorite: (serviceName: string, operationName: string) => void;
}

export const useUssdStore = create<UssdStoreState & UssdStoreActions>()(
  immer((set, get) => ({
    ussdServices: ussdServices,
    currentServiceIndex: 0,
    currentService: () => {
      const index = get().currentServiceIndex;
      return get().ussdServices[index];
    },
    setCurrentServiceByName: (serviceName: string) => {
      const serviceIndex = get().ussdServices.findIndex((s) => s.name === serviceName);
      const currentOperationName = get().currentOperation().name;
      if (serviceIndex !== -1) {
        set({ currentServiceIndex: serviceIndex, currentOperationIndex: 0 });
        get().setCurrentOperationByName(currentOperationName);
      }
    },
    currentOperationIndex: 0,
    currentOperation: () => {
      const service = get().currentService();
      const operationIndex = get().currentOperationIndex;
      return service.operations.length > operationIndex
        ? service.operations[operationIndex]
        : service.operations[0];
    },
    setCurrentOperationByName: (operationName: string) => {
      const service = get().currentService();
      const operationIndex = service.operations.findIndex((o) => o.name === operationName);
      operationIndex !== -1
        ? set({ currentOperationIndex: operationIndex })
        : set({ currentOperationIndex: 0 });
    },
    toggleOperationFavorite: (serviceName: string, operationName: string) => {
      set((state) => {
        const service = state.ussdServices.find((s) => s.name === serviceName);
        if (!service) {
          return;
        }
        const operation = service.operations.find((o) => o.name === operationName);
        if (!operation) {
          return;
        }
        operation.favorite = !operation.favorite;
      });
    },
  }))
);
