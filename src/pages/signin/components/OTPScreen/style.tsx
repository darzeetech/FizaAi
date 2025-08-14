import styled from 'styled-components';
import { Text } from '../../../../ui-component';

export const OTPHelpText = styled(Text)`
  margin-top: 16px;
`;

export const OTPBoxContainer = styled.div`
  margin: 40px 0px;
`;

export const OTPBox = styled.div`
  display: flex;
  justify-content: space-between;

  .otp {
    height: 48px;
    width: 48px;
    border: 1px solid var(--color-ghost);
    background-color: var(--color-white);
    border-radius: 16px;
    outline: none;
    text-align: center;
    font-size: 20px;
    margin: 0 5px;
    padding: 0px;
  }

  /* .otp-error {
    border-color: var(--color-tertiary);
  } */
`;

export const OTPTimerText = styled.div`
  width: inherit;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
`;
