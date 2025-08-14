import _isNil from 'lodash/isNil';
import { Options, CounterField, CheckboxGroupField } from '../';
import type { FormFieldType } from '../type';
import { FieldContainer } from './style';

export type FieldConfigProps = {
  field: FormFieldType;
  onChange: (value: any) => void;
};

const formComponents = ({ field, onChange }: FieldConfigProps) => {
  const { type } = field;

  switch (type) {
    case 'radio':
      return (
        <CheckboxGroupField {...field} options={field?.options as Options[]} onChange={onChange} />
      );
    case 'counter':
      return <CounterField {...field} onChange={onChange} />;
    default:
      return null;
  }
};

const FieldConfig = ({ field, onChange }: FieldConfigProps) => {
  const Component = formComponents({ field, onChange });

  if (_isNil(Component)) {
    return null;
  }

  return <FieldContainer>{Component}</FieldContainer>;
};

export default FieldConfig;
