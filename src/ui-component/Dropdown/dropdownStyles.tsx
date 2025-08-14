import { CSSProperties } from 'styled-components';
import _isNil from 'lodash/isNil';

export const styles: any = (menuWidth?: number) => {
  return {
    control: (
      baseStyles: CSSProperties,
      state: {
        isFocused: boolean;
        selectProps: {
          isDisabled: boolean;
          hasError: boolean;
        };
      }
    ) => ({
      ...baseStyles,
      borderColor: state.selectProps.hasError ? 'var(--color-tertiary)' : 'var(--color-ebonyClay)',
      fontSize: '14px',
      boxShadow:
        state.isFocused && !state.selectProps.hasError ? '0 0 0 1px var(--color-darkGray)' : 'none',
      '&:hover': {
        borderColor: state.selectProps.hasError
          ? 'var(--color-tertiary)'
          : 'var(--color-ebonyClay)',
      },
      background: state.selectProps.hasError
        ? 'var(--color-tertiary)'
        : state.selectProps.isDisabled
          ? 'var(--color-disabled)'
          : 'var(--color-white)',
      // color: state.selectProps.
    }),
    valueContainer: (baseStyles: CSSProperties) => ({
      ...baseStyles,
      padding: '8px 16px',
    }),
    input: (baseStyles: CSSProperties) => ({
      ...baseStyles,
      padding: 0,
      margin: 0,
    }),
    indicatorSeparator: (baseStyles: CSSProperties) => ({
      ...baseStyles,
      display: 'none',
    }),
    dropdownIndicator: (baseStyles: CSSProperties) => ({
      ...baseStyles,
      color: 'var(--color-ghost)',
      '&:hover': {
        color: 'inherit',
      },
    }),
    menu: (baseStyles: CSSProperties) => ({
      ...baseStyles,
      boxShadow: '0px 0px 16px var(--color-solitude)',
      borderRadius: '8px',
      ...(!_isNil(menuWidth) && { width: menuWidth }),
      zIndex: 100,
    }),
    menuList: (baseStyles: CSSProperties) => ({
      ...baseStyles,
      padding: 0,
      borderRadius: '8px',
    }),
    option: (baseStyles: CSSProperties, state: { isFocused: boolean; isSelected: boolean }) => ({
      ...baseStyles,
      padding: '5px 10',
      fontSize: 'inherit',
      backgroundColor:
        state.isFocused || state.isSelected ? 'var(--color-primary)' : 'var(--color-white)',
      color: 'inherit',
      '&:hover': {
        backgroundColor: 'var(--color-solitude)',
      },
    }),

    singleValue: (baseStyles: CSSProperties) => ({
      ...baseStyles,
      color: 'inherit',
    }),

    multiValue: (baseStyles: CSSProperties) => ({
      ...baseStyles,
      padding: '0px 5px',
      borderRadius: '25px',
      color: 'inherit',
    }),
    multiValueRemove: (baseStyles: CSSProperties) => ({
      ...baseStyles,
      '&:hover': {
        backgroundColor: 'inherit',
        color: 'inherit',
        borderRadius: '25px',
      },
    }),
  };
};
