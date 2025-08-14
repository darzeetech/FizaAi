import { useEffect, useState } from 'react';
import { ConfirmationResult, RecaptchaVerifier } from 'firebase/auth';

import { auth } from '../../firbase';
import { toasts } from '../../ui-component';

import LoginScreen from './components/LoginScreen';
import OTPScreen from './components/OTPScreen';

import { Container } from './style';

const Login = () => {
  const ISOCode = '+91';
  const [screenType, setScreenType] = useState('enterMoblie');
  const [mobileNumber, setMobileNumber] = useState<string>('');
  const [user, setUser] = useState<ConfirmationResult>();

  useEffect(() => {
    void setUpRecaptcha();
  }, []);

  const setUpRecaptcha = () => {
    try {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha', {
        size: 'invisible',
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        toasts('error', error.message, 'firebase-error');
      }
    }
  };

  return (
    <Container>
      {screenType === 'enterMoblie' && (
        <LoginScreen
          ISOCode={ISOCode}
          mobileNumber={mobileNumber}
          setMobileNumber={setMobileNumber}
          setScreenType={setScreenType}
          setUser={setUser}
        />
      )}
      {screenType === 'enterOTP' && (
        <OTPScreen
          ISOCode={ISOCode}
          mobileNumber={mobileNumber}
          user={user}
          setScreenType={setScreenType}
          setUser={setUser}
        />
      )}
      <div id="recaptcha" className="recaptcha"></div>
    </Container>
  );
};

export default Login;
