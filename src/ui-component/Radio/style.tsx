import styled, { css } from 'styled-components';

export const RadioContainer = styled.div``;

export const OptionContainer = styled.div<{ appearance: string }>`
  ${({ appearance }) =>
    appearance === 'horizontal' &&
    css`
      display: flex;
      justify-content: start;
      gap: 36px;
    `}

  .radio-input {
    cursor: pointer;
  }

  .radio-label {
    margin-left: 12px;
  }
`;

export const LabelContainer = styled.div`
  display: flex;
  margin-bottom: 10px;

  .mandatory {
    vertical-align: sub;
  }
`;
