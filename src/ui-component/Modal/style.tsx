import styled, { css } from 'styled-components';

export type ModalSize = 'small' | 'medium' | 'large' | 'xl';

type ModalContainerProps = {
  size: ModalSize;
};

const getModalSize = (size: ModalSize) => {
  switch (size) {
    case 'small':
      return css`
        width: 45vw;
        height: 35vh;
        max-width: 450px;
        max-height: 250px;
      `;
    case 'medium':
      return css`
        width: 55vw;
        height: 55vh;
        max-width: 600px;
        max-height: 450px;
      `;
    case 'large':
      return css`
        width: 65vw;
        height: 65vh;
        max-width: 750px;
        max-height: 650px;
      `;
    case 'xl':
      return css`
        width: 75vw;
        height: 75vh;
        max-width: 900px;
        max-height: 650px;
      `;
    default:
      return css`
        width: 70vw;
        height: 70vh;
        max-width: 780px;
        max-height: 660px;
      `;
  }
};

export const ModalContainer = styled.div<ModalContainerProps>`
  position: fixed;
  z-index: 1000;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  background-color: var(--color-white);
  transition: all 0.3s ease-in-out;

  ${({ size }) => getModalSize(size)}

  box-shadow:
    -5px -4px 4px 0px rgba(50, 50, 50, 0.06),
    3px 4px 4px 0px rgba(0, 0, 0, 0.08);

  .cross-icon {
    position: absolute;
    right: 4px;
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: var(--color-white);
    border-radius: 4px;
    cursor: pointer;
  }
`;

export const ModalHeader = styled.div`
  padding: 12px 24px;
  border-bottom: 1px solid rgba(168, 168, 168, 0.35);
`;

export const ModalBody = styled.div`
  flex: 1;
  overflow: auto;
  padding: 0px 24px;
  display: flex;
  flex-direction: column;
  /* position: relative; */
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: end;
  gap: 16px;
  padding: 12px 24px;
  border-top: 1px solid rgba(189, 190, 194, 0.7);
`;
