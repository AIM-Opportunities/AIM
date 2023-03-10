import React, { useCallback, useState } from "react";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import SocialSignInButtons from "../../components/SocialSignInButtons";
import { useNavigation } from "@react-navigation/native";
import { authentication } from "../../../firebase/firebase-config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { dbLite } from "../../../firebase/firebase-config";
import { getDoc, doc, setDoc } from "firebase/firestore/lite";

const SignUpScreen = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");

  const navigation = useNavigation();

  const onRegisterPressed = () => {
    createUserWithEmailAndPassword(authentication, email, password)
      .then((re) => {
        console.log(re);
        setIsSignedIn(true);
        //Add a new document in collection "userProfiles"
        updateUserProfile();
        navigation.navigate("SignIn");
      })
      .catch((re) => {
        console.log(re);
      });
  };

  const updateUserProfile = useCallback(async () => {
    await setDoc(doc(dbLite, "userProfiles", authentication.currentUser.uid), {
      email: authentication.currentUser.email,
    });
  }, []);
  
  const onSignInPressed = () => {
    navigation.navigate("SignIn");
  };

  const onTermsOfUsePressed = () => {
    console.warn("TOS");
  };

  const onPrivacyPolicyPressed = () => {
    console.warn("Privacy Policy");
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "center",
        alignSelf: "center",
      }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.root}>
        <Text style={styles.title}>Create an account</Text>
        <CustomInput placeholder="Email" value={email} setValue={setEmail} />
        <CustomInput
          placeholder="Password"
          onChangeText={(text) => setPassword(text)}
          value={password}
          setValue={setPassword}
          secureTextEntry
        />
        <CustomInput
          placeholder="Repeat Password"
          value={passwordRepeat}
          setValue={setPasswordRepeat}
          secureTextEntry
        />
        <CustomButton text="Register" onPress={onRegisterPressed} />
        <Text style={styles.text}>
          By registering, you confirm that you accept our{" "}
          <Text style={styles.link} onPress={onTermsOfUsePressed}>
            Terms of Use
          </Text>{" "}
          and{" "}
          <Text style={styles.link} onPress={onPrivacyPolicyPressed}>
            Privacy Policy
          </Text>
          .
        </Text>

        <SocialSignInButtons />

        <CustomButton
          text="Have an account? Sign in"
          onPress={onSignInPressed}
          type="TERTIARY"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    margin: 10,
  },
  text: {
    color: "white",
    marginVertical: 10,
  },
  link: {
    color: "#ff9e3e",
  },
});

export default SignUpScreen;
