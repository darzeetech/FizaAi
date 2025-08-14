export type RegexObj = {
  expression: string;
  message?: string;
};

export const integerRegex: RegexObj = {
  expression: '^\\d+$',
  message: 'Please enter valid number',
};

export const mobileNumberRegex: RegexObj = {
  expression: '^[0-9]{10}$',
  message: 'Please enter 10 digit number',
};

export const positiveNumberRegex: RegexObj = {
  expression: '^\\d+(\\.\\d+)?$',
  message: 'Please enter valid number',
};
