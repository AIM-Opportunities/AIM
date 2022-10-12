import React from 'react';
import CustomButton from '../CustomButton';

const onSignInGoogle = () => {
  console.warn('Google');
};

const onSignInFacebook = () => {
  console.warn('Facebook');
};

const onSignInApple = () => {
  console.warn('Apple');
};

const SocialSignInButtons = () => {
  return (
    <>
      <CustomButton
        text="Sign In with Google"
        onPress={onSignInGoogle}
        bgColor="#FAE9EA"
        fgColor="#DD4D44"
      />
      <CustomButton
        text="Sign In with Facebook"
        onPress={onSignInFacebook}
        bgColor="#E7EAF4"
        fgColor="#4765A9"
      />
      <CustomButton
        text="Sign In with Apple"
        onPress={onSignInApple}
        bgColor="#e3e3e3"
        fgColor="#363636"
      />
    </>
  );
};

export default SocialSignInButtons;
