import styled from 'styled-components';

export const Container = styled.div`
  height: 60px;
  width: inherit;
  /* position: fixed; */
  border-bottom: 1px solid rgba(50, 50, 50, 0.15);
  background-color: var(--color-white);
  padding: 12px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* z-index: 100; */

  .title-container {
    display: flex;
    gap: 12px;
    align-items: baseline;
  }
`;

export const HeaderInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

export const Circle = styled.div`
  img {
    width: 36px;
    height: 36px;
    border-radius: 50%;
  }
`;
