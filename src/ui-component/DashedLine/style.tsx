import styled from 'styled-components';

type LineContainerProps = {
  color?: string;
};

export const LineContainer = styled.div<LineContainerProps>`
  width: 100%;
  height: 3px;
  border: none;
  border-top: 1px dashed var(--color-nightRider);
  background-color: transparent;
  color: var(--color-nightRider);
`;
