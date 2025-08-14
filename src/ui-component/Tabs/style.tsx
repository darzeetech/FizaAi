import styled, { css } from 'styled-components';

// width is required when isSticky is true
export const TabList = styled.div<{ $isSticky: boolean; width?: string }>`
  display: flex;
  align-items: center;
  justify-content: start;

  ${({ $isSticky, width = '100%' }) =>
    $isSticky &&
    css`
      position: fixed;
      width: ${width};
      background: var(--color-white);
      z-index: 100;
      height: 50px;
    `}
`;

export const Tab = styled.div<{ isActive?: boolean }>`
  position: relative;
  cursor: pointer;
  padding: 16px 24px;

  ${({ isActive = false }) =>
    isActive &&
    `&::before {
    content: '';
    width: 100%;
    height: 3px;
    background-color: var(--color-primary);
    border-radius: 8px;
    position: absolute;
    bottom: 0;
    inset-inline-start: 0;
  }`}
`;
