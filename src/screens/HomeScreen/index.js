/* eslint-disable react-native/no-inline-styles */
import {View, Text} from 'react-native';
import React from 'react';
import CustomButton from '../../components/CustomButton';
import {useNavigation} from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();
  const onSignInPressed = () => {
    navigation.navigate('SignIn');
  };
  return (
    <View>
      <Text
        style={{
          fontSize: 24,
          alignSelf: 'center',
          marginBottom: 300,
        }}>
        Home, sweet home
      </Text>
      <CustomButton text="Back to Sign In" onPress={onSignInPressed} />
    </View>
  );
};

export default HomeScreen;
