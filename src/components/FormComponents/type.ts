import { ReactNode } from 'react';

import { RegexObj } from '../../utils/regexValue';
import { ValueFormatType } from './DateField';

export type Options = {
  label: string;
  value: string;
};

export type ImageObjType = Record<string, string>;

export type FormFieldType = {
  id: number;
  type: string;
  key: string;
  value: any;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  required?: boolean;
  defaultValue?: any;
  rows?: number;
  min_value?: number;
  max_value?: number;
  accept?: string;
  className?: string;
  multiple?: boolean;
  maxUpload?: number;
  errorMsg?: string;
  leadingIcon?: ReactNode;
  regex?: RegexObj;
  options?: Array<Record<string, any>>;
  dateFormat?: string;
  valueFormat?: ValueFormatType;
};
