import _isEmpty from 'lodash/isEmpty';

import Select from 'react-select';
import type { Props as ReactSelectProps } from 'react-select';

import { Options } from '../../components/FormComponents/type';

import { styles } from './dropdownStyles';
import { DropdonContainer, LabelContainer } from './style';
import { Text } from '../';

export type DropdownProps = ReactSelectProps & {
  label: string;
  placeholder?: string;
  defaultValue?: string;
  multiple?: boolean;
  value?: Options | Options[];
  className?: string;
  disabled?: boolean;
  required?: boolean;
  errorMessage?: string;
  CustomOption?: (props: any) => JSX.Element;
  SingleValue?: (props: any) => JSX.Element;
  //   options: Record<string, any>;
};

const Dropdown = ({
  label,
  placeholder = 'Select...',
  multiple = false,
  isClearable = false,
  hideSelectedOptions,
  options = [],
  disabled = false,
  required = false,
  errorMessage = '',
  onChange,
  CustomOption,
  SingleValue,
  ...rest
}: DropdownProps) => {
  const hasError = !_isEmpty(errorMessage);

  return (
    <DropdonContainer hasError={hasError} hideSelectedOptions={hideSelectedOptions}>
      {!_isEmpty(label) && (
        <LabelContainer>
          <Text color="black" fontWeight={500}>
            {label}
            {required && (
              <Text color="black" className="mandatory">
                *
              </Text>
            )}
          </Text>
        </LabelContainer>
      )}

      <Select
        key={`my_unique_select_key__${rest?.value}`}
        menuPlacement="auto"
        styles={styles}
        placeholder={placeholder}
        className="custom-select" // Add a custom class name
        classNamePrefix="custom-select" // Add a custom class name prefix
        options={options}
        onChange={onChange}
        isMulti={multiple}
        isClearable={isClearable}
        isSearchable={true}
        // eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error
        // @ts-ignore
        hasError={hasError}
        isDisabled={disabled}
        components={{
          ...(typeof CustomOption === 'function' && { Option: CustomOption }),
          ...(typeof SingleValue === 'function' && { SingleValue: SingleValue }),
        }}
        {...rest}
      />
      {hasError && (
        <Text color="red" size="small">
          {errorMessage}
        </Text>
      )}
    </DropdonContainer>
  );
};

export default Dropdown;
