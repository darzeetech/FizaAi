import styled from 'styled-components';

type ContainerProps = {
  top?: string;
  left?: string;
};

export const Container = styled.div<ContainerProps>`
  position: fixed;
  width: 100%;
  height: calc(100vh - 60px);
  top: ${({ top = '60px' }) => top};
  left: ${({ left = 0 }) => left};
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 10000;
  cursor: pointer;

  .loader {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 5px solid var(--color-ghost);
    border-top: 5px solid var(--color-primary);
    animation: spin infinite 2s linear;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
