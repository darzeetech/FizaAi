import styled from 'styled-components';

export const CardContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 245px;
  height: 60px;
  background-color: var(--color-white);
  border-bottom: 1px solid rgba(50, 52, 58, 0.1);
  cursor: pointer;

  .profile-pic {
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    background: rgba(77, 122, 255, 0.2);
  }

  .content {
    flex: 1;
  }
`;
