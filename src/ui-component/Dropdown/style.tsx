import styled, { css } from 'styled-components';

type DropdownContainerProps = {
  hasError: boolean;
  hideSelectedOptions?: boolean;
};

export const DropdonContainer = styled.div<DropdownContainerProps>`
  width: 100%;
  /* border: 1px solid var(--color-ebonyClay); */
  /* border-radius: 6px; */
  /* height: 40px; */
  /* padding: 0 24px; */
  font-size: 14px;
  outline: none;
  &:disabled {
    background: var(--color-disabled);
  }

  ${({ hideSelectedOptions = false }) =>
    hideSelectedOptions &&
    css`
      .custom-select__multi-value {
        display: none;
      }
    `}
`;

export const LabelContainer = styled.div`
  display: flex;
  margin-bottom: 10px;

  .mandatory {
    display: inline;
  }
`;
