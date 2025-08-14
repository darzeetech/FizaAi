import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConfirmationResult, signInWithPhoneNumber } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import _isEmpty from 'lodash/isEmpty';
import _isNil from 'lodash/isNil';

import { auth } from '../../../../firbase';
import { api } from '../../../../utils/apiRequest';
import {
  getValueFromLocalStorage,
  setValueInLocalStorage,
  validateValueWithRegex,
} from '../../../../utils/common';
import { integerRegex } from '../../../../utils/regexValue';

import { Button, Loader, Text, toasts } from '../../../../ui-component';
import { RightArrowIcon } from '../../../../assets/icons';
import { updateBoutiqueData } from '../../../profile/reducer';

import { updateUserData } from '../..//reducer';

import { LoginContainer, ScreenContainer } from '../../style';
import { OTPBox, OTPBoxContainer, OTPTimerText } from './style';

type OTPScreenProps = {
  ISOCode: string;
  mobileNumber: string;
  setScreenType: (type: string) => void;
  user?: ConfirmationResult;
  setUser: (user: ConfirmationResult) => void;
};

const OTPScreen = (props: OTPScreenProps) => {
  const otpNumCount = 6;
  const maxOtpTimer = 45;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { ISOCode, mobileNumber, user, setUser } = props;

  const [isLoading, setIsLoading] = useState(false);

  const [otp, setOtp] = useState<string[]>(Array(otpNumCount).fill(''));
  const [otpTimer, setOtpTimer] = useState<number>(maxOtpTimer);
  const [errMsg, setErrMsg] = useState('');

  const inputRefs = useRef<HTMLInputElement[] | null>([]);

  useEffect(() => {
    if (otpTimer > 0) {
      const timerID = setInterval(() => setOtpTimer((otpTimer) => otpTimer - 1), 1000);

      return () => clearInterval(timerID);
    }
  }, [otpTimer]);

  const addToRefs = (el: HTMLInputElement) => {
    if (el && inputRefs.current && !inputRefs.current.includes(el)) {
      inputRefs.current.push(el);
    }
  };

  const onFocus = (e: ChangeEvent<HTMLInputElement>) => {
    e.target.removeAttribute('readOnly');
    // clearOtpErrorMessages();
  };

  const focusNext = (index: number) => {
    if (index < otpNumCount - 1 && inputRefs.current) {
      inputRefs.current[index + 1].focus();
    }
  };

  const focusPrevious = (index: number) => {
    if (inputRefs.current) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleOtpInput = (value: string, index: number) => {
    const newOtp = otp.map((number, i) => (i === index ? value : number));
    setOtp(newOtp);
  };

  const handleChange = (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    handleOtpInput(value, index);

    const { valid, message } = validateValueWithRegex(value, integerRegex);

    if (valid && index !== otpNumCount - 1) {
      focusNext(index);
      setErrMsg('');
    } else {
      setErrMsg(message);
    }
  };

  const handleKeyDown = (index: number) => (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === 8 && index !== 0) {
      if (_isEmpty(otp[index])) {
        focusPrevious(index);
      } else {
        handleOtpInput('', index);
        setErrMsg('');
      }
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setIsLoading(true);

      if (!_isNil(user)) {
        const response = await user.confirm(otp.join(''));

        if (!_isNil(response.user)) {
          const response = await api.postRequest('tailor/login', {
            phone_number: mobileNumber,
          });

          if (
            !_isNil(response) &&
            !_isNil(response.data) &&
            !_isEmpty(response.data) &&
            (response.status as boolean) &&
            response.data.boutique_id != 0
          ) {
            const { data } = response;
            //const newToken = await response.user.getIdToken(true);
            //const token = await auth.currentUser?.getIdToken();
            // setValueInLocalStorage('token', data.token);
            //setValueInLocalStorage('token', newToken);
            setValueInLocalStorage('boutique_id', data.boutique_id);

            const userData = { phone_number: mobileNumber, extention: ISOCode, ...data };

            setValueInLocalStorage('userDetails', userData);

            dispatch(
              updateUserData({
                data: userData,
              })
            );

            void getBoutiqueDetails();

            navigate('/dashboard');
          } else {
            const userData = { phone_number: mobileNumber, extention: ISOCode };
            setValueInLocalStorage('userDetails', userData);

            dispatch(updateUserData({ data: userData }));

            navigate('/onboarding');
          }
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toasts('error', error.message ?? '', 'firebase-error');
      }
    }
    setIsLoading(false);
  };

  const handleResendOtp = async () => {
    try {
      setIsLoading(true);
      const recaptcha = await (window as any).recaptchaVerifier;

      const confirmation = await signInWithPhoneNumber(auth, ISOCode + mobileNumber, recaptcha);
      setUser(confirmation);

      setOtpTimer(maxOtpTimer);
      setOtp(Array(otpNumCount).fill(''));
    } catch (error: unknown) {
      if (error instanceof Error) {
        toasts('error', error.message ?? '', 'firebase-error');
      }
    }
    setIsLoading(false);
  };

  const getBoutiqueDetails = async () => {
    const boutique_id = getValueFromLocalStorage('boutique_id');

    if (!_isNil(boutique_id)) {
      const response = await api.getRequest(`boutique/${boutique_id}`);

      const { data, status } = response;

      if (status) {
        dispatch(updateBoutiqueData({ boutiqueData: data }));
      }
    }
  };

  return (
    <ScreenContainer>
      <LoginContainer>
        <Text size="xxxl" color="var(--color-black)" fontWeight={800}>
          Verify Phone Number
        </Text>

        <Text color="var(--color-black)" className="login-help-text">
          {`Check your SMS messages. We've sent you
            a PIN at ${mobileNumber}`}
        </Text>

        <OTPBoxContainer>
          <OTPBox className="input-otp">
            {otp.map((val: string, index: number) => (
              <input
                autoFocus={index === 0}
                className={`otp ${!_isEmpty(errMsg) && 'otp-error'}`}
                maxLength={1}
                type="text"
                onChange={handleChange(index)}
                onKeyDown={handleKeyDown(index)}
                ref={addToRefs}
                key={index}
                value={val}
                onFocus={onFocus}
                autoComplete="new-password"
                readOnly
              />
            ))}
          </OTPBox>
          {!_isEmpty(errMsg) && <Text color="tertiary">{errMsg}</Text>}
        </OTPBoxContainer>

        <OTPTimerText>
          <Text color="var(--color-ebonyClay)" fontWeight={600}>
            {`Didn't receive SMS?`}
          </Text>
          <Text color="var(--color-islamicGreen)" fontWeight={600}>
            {`0:${otpTimer} Sec`}
          </Text>
        </OTPTimerText>

        {otpTimer !== 0 && (
          <Button
            className="otp-btn"
            disabled={!_isEmpty(errMsg)}
            trailingIcon={<RightArrowIcon />}
            onClick={handleVerifyOtp}
          >
            Verify OTP
          </Button>
        )}

        {otpTimer === 0 && (
          <Button className="otp-btn" trailingIcon={<RightArrowIcon />} onClick={handleResendOtp}>
            Resend OTP
          </Button>
        )}
      </LoginContainer>
      <Loader showLoader={isLoading} />
    </ScreenContainer>
  );
};

export default OTPScreen;
