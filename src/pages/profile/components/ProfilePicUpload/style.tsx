import styled from 'styled-components';

export const Container = styled.div`
  width: inherit;
  max-width: 100%;
  display: flex;
  flex-direction: column;

  .input-file {
    width: 0.1px;
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    z-index: 1;
  }
`;

export const UploadButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  text-transform: uppercase;
  border: 1px solid var(--color-black);
  background-color: var(--color-white);
  color: var(--color-black);
  font-size: 14px;
  padding: 8px 16px;
  border-radius: 8px;

  .edit-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
  }
`;

export const Field = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 24px;

  .circle {
    width: 100px;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 80px;
      height: 80px;
      border-radius: 50%;
    }
  }
`;
