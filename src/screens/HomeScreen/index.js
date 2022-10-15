/* eslint-disable react-native/no-inline-styles */
import {
  Text,
  View,
  ScrollView,
  StyleSheet
} from 'react-native';
import React, {useState, useEffect} from 'react';
import CustomButton from '../../components/CustomButton';
import {useNavigation} from '@react-navigation/native';
import {db} from '../../../firebase/firebase-config';
import {collection, getDoc, doc,setDoc, DocumentData} from 'firebase/firestore/lite';
import firestore, { endAt } from 'firebase/firestore';
import {authentication} from '../../../firebase/firebase-config';
import {signInWithEmailAndPassword, signOut} from 'firebase/auth';
import CustomInput from '../../components/CustomInput';

const HomeScreen = () => {
  const [isSignedIn, setIsSignedIn] = useState(!!authentication.currentUser);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [occupation, setOccupation] = useState('');

  const navigation = useNavigation();
  

    const [data, setData] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
  
    useEffect(() => {
      const getDocument = async () => {
        setLoading(true);
  
        try {
          const docRef = doc(db, 'userProfiles', authentication.currentUser.uid);
          const docSnap = await getDoc(docRef);
  
          if (docSnap.exists()) {
            setFirstName(docSnap.get("First Name"));
            setLastName(docSnap.get("Last Name"));
            setOccupation(docSnap.get("occupation"));
          } else {
            setData(undefined);
            console.log('No document!');
          }
        } catch (e) {
          setError(e.message);
        }
        setLoading(false);
      };
      getDocument();
    }, [] );
  
  // press events can be async  
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
        setIsSignedIn(false);
        navigation.navigate('SignIn')
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <ScrollView 
    contentContainerStyle={{
      flexGrow: 3, 
      justifyContent: 'center',
      
    }} 
    showsVerticalScrollIndicator={false}
    >
      <View style={styles.root}>
        <Text
          style={{
            fontSize: 24,
          }}>
          User Profile
        </Text>
        <CustomInput 
          placeholder= 
            {firstName === null || undefined ? (
              {firstName}
            ) : (
              "First Name"
            )} 
          value={firstName} 
          setValue={setFirstName}
        />
        <CustomInput 
          placeholder=
            {lastName === null || undefined ? (
              {lastName}
            ) : (
              "Last Name"
            )} 
          value={lastName} 
          setValue={setLastName}
        />
        <CustomInput 
          placeholder= 
            {occupation === null || undefined ? (
              {occupation}
            ) : (
              "Occupation"
            )} 
          value= {occupation}
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

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    padding: 50,
  }
});
export default HomeScreen;
