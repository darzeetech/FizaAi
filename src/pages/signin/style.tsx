import styled from 'styled-components';

export const Container = styled.div`
  width: inherit;
  height: calc(100vh - 60px);
`;

export const ScreenContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: inherit;
  height: inherit;
  width: inherit;
`;

export const LoginContainer = styled.div`
  width: 30vw;
  max-width: 350px;
  min-width: 350px;

  .login-help-text {
    margin-top: 16px;
  }

  .recaptcha {
    margin-top: 16px;
  }

  .otp-btn {
    width: inherit;
    max-width: inherit;
    margin-top: 16px;
  }
`;
