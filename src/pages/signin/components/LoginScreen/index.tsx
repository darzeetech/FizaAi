import { ChangeEvent, useState } from 'react';
import { ConfirmationResult, signInWithPhoneNumber } from 'firebase/auth';
import _isEmpty from 'lodash/isEmpty';

import { auth } from '../../../../firbase';
import { mobileNumberRegex } from '../../../../utils/regexValue';
import { validateValueWithRegex } from '../../../../utils/common';
import { Button, Loader, Text, toasts } from '../../../../ui-component';
import { RightArrowIcon } from '../../../../assets/icons';

import { ScreenContainer, LoginContainer } from '../../style';

import { MobileNumber } from './style';

type LoginScreenProps = {
  ISOCode: string;
  mobileNumber: string;
  setMobileNumber: (num: string) => void;
  setScreenType: (type: string) => void;
  setUser: (user: ConfirmationResult) => void;
};

const LoginScreen = (props: LoginScreenProps) => {
  const { ISOCode, mobileNumber, setMobileNumber, setScreenType, setUser } = props;

  const [errMsg, setErrMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleMobileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const { valid, message } = validateValueWithRegex(value, mobileNumberRegex);

    setMobileNumber(value);

    if (valid) {
      setErrMsg('');
    } else {
      setErrMsg(message);
    }
  };

  const handleRequestOtp = async () => {
    try {
      setIsLoading(true);

      if (_isEmpty(errMsg)) {
        const recaptcha = await (window as any).recaptchaVerifier;

        const confirmation = await signInWithPhoneNumber(auth, ISOCode + mobileNumber, recaptcha);
        setUser(confirmation);

        setScreenType('enterOTP');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toasts('error', error.message, 'request-otp');
      }
    }
    setIsLoading(false);
  };

  return (
    <ScreenContainer>
      <LoginContainer>
        <Text size="xxxl" color="var(--color-black)" fontWeight={800}>
          Login Account
        </Text>
        <Text color="var(--color-black)" className="login-help-text">
          Please enter your mobile number to receive a One Time Password via SMS
        </Text>

        <MobileNumber>
          <Text color="var(--color-ghost)" className="iso-code">
            {ISOCode}
          </Text>
          <input
            autoFocus
            type="text"
            maxLength={10}
            name="login-mobile"
            placeholder="Phone Number"
            value={mobileNumber}
            onChange={handleMobileInput}
            className="login-mobile"
          />
        </MobileNumber>

        {!_isEmpty(errMsg) && <Text color="tertiary">{errMsg}</Text>}

        <Button
          className="otp-btn"
          disabled={!_isEmpty(errMsg) || _isEmpty(mobileNumber)}
          trailingIcon={<RightArrowIcon />}
          onClick={handleRequestOtp}
        >
          Request OTP
        </Button>
      </LoginContainer>
      <Loader showLoader={isLoading} />
    </ScreenContainer>
  );
};

export default LoginScreen;
