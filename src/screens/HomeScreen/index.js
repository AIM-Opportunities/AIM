/* eslint-disable react-native/no-inline-styles */
import {
  Text,
  View,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import CustomButton from '../../components/CustomButton';
import {useNavigation} from '@react-navigation/native';
import {db} from '../../../firebase/firebase-config';
import {collection, getDocs, doc,setDoc} from 'firebase/firestore/lite';
import firestore from 'firebase/firestore';
import {authentication} from '../../../firebase/firebase-config';
import {signInWithEmailAndPassword, signOut} from 'firebase/auth';
import CustomInput from '../../components/CustomInput';

const HomeScreen = () => {
  const [isSignedIn, setIsSignedIn] = useState(!!authentication.currentUser);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [occupation, setOccupation] = useState('');

  const navigation = useNavigation();

  const onSetDataPressed = async () =>{
    //Add a new document in collection "userProfiles"
    await setDoc(doc(db, "userProfiles", authentication.currentUser.uid,
    )
    , {
      'First Name': firstName,
      'Last Name': lastName,
      email: authentication.currentUser.email,
      occupation: occupation
      
    });


  }

  const onSignOutPressed = () => {
    signOut(authentication)
      .then(re => {
        setIsSignedIn('false');
        navigation.navigate('SignIn')
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <ScrollView 
    contentContainerStyle={{
      flexGrow: 1, 
      justifyContent: 'center',
      alignSelf:'center'
    }} 
    showsVerticalScrollIndicator={false}
    >
      <View>
        <Text
          style={{
            fontSize: 24,
          }}>
          User Profile
        </Text>
        <CustomInput 
          placeholder= "First Name"
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
    </ScrollView>
  );
};

export default HomeScreen;
