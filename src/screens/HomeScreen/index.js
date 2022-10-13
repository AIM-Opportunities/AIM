/* eslint-disable react-native/no-inline-styles */
import {View, Text} from 'react-native';
import React, {useState} from 'react';
import CustomButton from '../../components/CustomButton';
import {useNavigation} from '@react-navigation/native';
import {db} from '../../../firebase/firebase-config';
import {collection, getDocs, doc,setDoc} from 'firebase/firestore/lite';
import { authentication } from '../../../firebase/firebase-config';
import CustomInput from '../../components/CustomInput';

const HomeScreen = async () => {
  const [isSignedIn, setIsSignedIn] = useState(!!authentication.currentUser);

  // get data WIP
  // const userProfileCol = collection(db,'userProfiles',authentication.currentUser.uid)
  // const userProfileSnapshot = await getDocs(userProfileCol);
  // const userProfileList = userProfileSnapshot.docs.map(doc => doc.data());

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [occupation, setOccupation] = useState('');

  const navigation = useNavigation();
  const onSetDataPressed = async () =>{
    // Add a new document in collection "userProfiles"
    await setDoc(doc(db, "userProfiles", authentication.currentUser.uid,
    ), {
      'First Name': firstName,
      'Last Name': lastName,
      email: authentication.currentUser.email,
      occupation: "swe"
    });


  }
  const onSignInPressed = () => {
    navigation.navigate('SignIn');
  };
  const onSignOutPressed = () => {
    signOut(authentication)
      .then(re => {
        setIsSignedIn(false);
        navigation.navigate('SignIn')
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <View>
      <Text
        style={{
          fontSize: 24,
          alignSelf: 'center',
          marginBottom: 300,
        }}>
        User Profile
      </Text>
      <CustomInput 
        placeholder="First Name" 
        value={firstName} 
        setValue={setFirstName}
      />
      <CustomInput 
        placeholder="Last Name" 
        value={lastName} 
        setValue={setLastName}
      />
      <CustomInput 
        placeholder="Occupation" 
        value={occupation} 
        setValue={setOccupation}
      />
      <CustomButton text="Set Data" onPress={onSetDataPressed} />
      {isSignedIn === true && (
          <CustomButton text="Sign Out" onPress={onSignOutPressed} />
        ) 
        }
    </View>
  );
};

export default HomeScreen;
