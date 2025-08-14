import type { FormFieldType } from '../type';

import FieldConfig from './FieldConfig';
import { FormContainer } from './style';

type DynamicFormProps = {
  formFields: FormFieldType[];
  onChange: (value: any, key: number) => void;
};

const DynamicForm = ({ formFields, onChange }: DynamicFormProps) => {
  return (
    <FormContainer>
      {formFields.map((field, index) => (
        <FieldConfig key={index} field={field} onChange={(value) => onChange(value, field.id)} />
      ))}
    </FormContainer>
  );
};

export default DynamicForm;
