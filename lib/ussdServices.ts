export type UssdService = {
  name: string;
  operations: USSDServiceOpearation[];
};

export type USSDServiceOpearation = {
  name: string;
  shortCode: string;
  parameters: { name: string }[];
};

export type OperationParameterValues = Record<string, string>;

export const generateShortCode = (
  operation: USSDServiceOpearation,
  parameters: OperationParameterValues
) => {
  if(operation.parameters.length >  Object.keys(parameters).length) {
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

export const ussdServices: UssdService[] = [
  {
    name: 'Zaad USD',
    operations: [
      {
        name: 'Send Money',
        shortCode: '*880*{Recipient}*{Amount}#',
        parameters: [{ name: 'Recipient' }, { name: 'Amount' }],
      },
      {
        name: 'Merchant Payment',
        shortCode: '*883*{Merchant}*{Amount}#',
        parameters: [{ name: 'Merchant' }, { name: 'Amount' }],
      },
    ],
  },
  {
    name: 'Zaad SLSH',
    operations: [
      {
        name: 'Send Money',
        shortCode: '*220*{Recipient}*{Amount}#',
        parameters: [{ name: 'Recipient' }, { name: 'Amount' }],
      },
    ],
  },
  {
    name: 'eDahab USD',
    operations: [
      {
        name: 'Send Money',
        shortCode: '*110*{Recipient}*{Amount}#',
        parameters: [{ name: 'Recipient' }, { name: 'Amount' }],
      },
    ],
  },
  {
    name: 'eDahab SLSH',
    operations: [
      {
        name: 'Send Money',
        shortCode: '*113*{Recipient}*{Amount}#',
        parameters: [{ name: 'Recipient' }, { name: 'Amount' }],
      },
    ],
  },
];
