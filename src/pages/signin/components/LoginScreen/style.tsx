import styled from 'styled-components';

export const MobileNumber = styled.div`
  position: relative;
  height: 52px;
  width: inherit;
  max-width: inherit;
  margin-top: 40px;
  background-color: var(--color-white);

  .iso-code {
    border-right: 1px solid var(--color-ghost);
    position: absolute;
    top: 14px;
    left: 8px;
    padding-right: 4px;
  }

  .login-mobile {
    border-radius: 8px;
    border: 1px solid var(--color-ghost);
    outline: none;
    height: inherit;
    width: inherit;
    max-width: inherit;
    padding: 16px 16px 16px 48px;
  }
`;
