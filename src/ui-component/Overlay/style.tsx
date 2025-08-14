import styled from 'styled-components';

type OverlayStyledProps = {
  show: boolean;
};

export const OverlayStyled = styled.div<OverlayStyledProps>`
  position: fixed;
  height: 100vh;
  width: 100vw;
  background-color: transparent;
  left: 0;
  top: 0;
  z-index: 300;
  ${({ show }) => show && 'background-color: rgba(1, 1, 1, 0.4)'}
`;
