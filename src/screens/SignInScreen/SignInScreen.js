import React, {useState} from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  useWindowDimensions,
  ScrollView,
} from 'react-native';
import Logo from '../../../assets/images/ProjectX-Logo.png';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import SocialSignInButtons from '../../components/SocialSignInButtons';
import {useNavigation} from '@react-navigation/native';
import {authentication} from '../../../firebase/firebase-config';
import {signInWithEmailAndPassword, signOut} from 'firebase/auth';

const SignInScreen = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const {height, width} = useWindowDimensions();
  const navigation = useNavigation();

  const onSignInPressed = () => {
    signInWithEmailAndPassword(authentication, email, password)
      .then(re => {
        console.log(re);
        setIsSignedIn(true);
        navigation.navigate('Home');
      })
      .catch(re => {
        console.log(re);
      });
  };

  const onForgotPasswordPressed = () => {
    navigation.navigate('ForgotPassword');
  };

  const onSignUpPressed = () => {
    navigation.navigate('SignUp');
  };

  const onSignOutPressed = () => {
    signOut(authentication)
      .then(re => {
        setIsSignedIn(false);
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <ScrollView 
      contentContainerStyle={{
        maxWidth: 400,
        flexGrow: 1, 
        alignSelf:'center',
        justifyContent: 'center',
      }} 
      showsVerticalScrollIndicator={false}
      >
      <View style={styles.root}>
        <Image
          source={Logo}
          style={[styles.logo, {height: height * 0.2}]}
          resizeMode="contain"
        />
        <CustomInput placeholder="Email" value={email} setValue={setEmail} />
        <CustomInput
          placeholder="Password"
          value={password}
          setValue={setPassword}
          secureTextEntry
        />
        {isSignedIn === !!!authentication.currentUser ? (
          <CustomButton text="Sign Out" onPress={onSignOutPressed} />
        ) : (
          <CustomButton text="Sign In" onPress={onSignInPressed} />
        )}
        <CustomButton
          text="Forgot Password?"
          onPress={onForgotPasswordPressed}
          type="TERTIARY"
        />
        <SocialSignInButtons />
        <CustomButton
          text="Don't have an account? Create one"
          onPress={onSignUpPressed}
          type="TERTIARY"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    
  },
  logo: {
    width: '100%',
    maxWidth: 500,
    maxHeight: 500,
  },
});

export default SignInScreen;
