import { Text, View, ScrollView, StyleSheet } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import React, { useState, useEffect } from "react";
import CustomButton from "../../components/CustomButton";
import { useNavigation } from "@react-navigation/native";
import { dbLite } from "../../../firebase/firebase-config";
import { getDoc, doc, setDoc, updateDoc } from "firebase/firestore/lite";
import { authentication } from "../../../firebase/firebase-config";
import { signOut } from "firebase/auth";
import CustomInput from "../../components/CustomInput";
import FileInput from "../../components/FileInput";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../../firebase/firebase-config";
import moment from "moment";

const ProfileScreen = () => {
  const [isSignedIn, setIsSignedIn] = useState(!!!authentication.currentUser);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [occupation, setOccupation] = useState("");
  const [lookingFor, setLookingFor] = useState("");
  const [interestStore, setinterestStore] = useState(null);

  const navigation = useNavigation();
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [blobFile, setBlobFile] = useState([]);
  const [fileName, setFileName] = useState([]);
  const [completed, setCompleted] = useState(false);

  // get user data and display it
  useEffect(() => {
    const getDocument = async () => {
      setLoading(true);

      try {
        const docRef = doc(
          dbLite,
          "userProfiles",
          authentication.currentUser.uid
        );
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setFirstName(docSnap.get("First Name"));
          setLastName(docSnap.get("Last Name"));
          setOccupation(docSnap.get("occupation"));
          setLookingFor(docSnap.get("lookingFor"));
          setinterestStore(docSnap.get("interests"));
        } else {
          setData(undefined);
          console.log("No document!");
        }
      } catch (e) {
        setError(e.message);
      }
      setLoading(false);
    };
    getDocument();
  }, []);

  // set the user data in firestore db
  // press events can be async
  const onSetDataPressed = async () => {
    //Add a new document in collection "userProfiles"
    await updateDoc(
      doc(dbLite, "userProfiles", authentication.currentUser.uid),
      {
        "First Name": firstName,
        "Last Name": lastName,
        email: authentication.currentUser.email,
        occupation: occupation,
        lookingFor: lookingFor,
      }
    );
    navigation.navigate("Home");
  };

  const onSignOutPressed = () => {
    signOut(authentication)
      .then((re) => {
        setIsSignedIn(false);
        navigation.navigate("SignIn");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getFileInformation = async () => {
    const result = await DocumentPicker.getDocumentAsync({});
    if (result != null) {
      const document = await fetch(result.uri);
      const documentBlob = await document.blob();
      setFileName(result.name);
      setBlobFile(documentBlob);
    }
  };

  const uploadFile = (blobFile, fileName, isUploadCompleted) => {
    if (!blobFile) return;
    const currentDate = moment().format("DD_MM_YYYY");
    const storageRef = ref(
      storage,
      `RESUME_${authentication.currentUser.uid}_${lastName}_${firstName}_${currentDate}`
    );
    const uploadTask = uploadBytesResumable(storageRef, blobFile);
    uploadTask.on(
      "state_changed",
      null,
      (error) => console.log(error),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          isUploadCompleted(true);
          return downloadURL;
        });
      }
    );
  };

  const isUploadCompleted = (completed) => {
    setCompleted(completed);
  };

  const onUploadResumePressed = () => {
    getFileInformation();
    uploadFile(blobFile, fileName, isUploadCompleted);
  };

  return (
    <ScrollView
      contentContainerStyle={{
        maxWidth: 400,
        flexGrow: 1,
        alignSelf: "center",
        justifyContent: "center",
      }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.root}>
        <Text
          style={{
            fontSize: 24,
            color: "white",
          }}
        >
          User Profile
        </Text>
        <CustomInput
          placeholder={
            firstName === null || undefined ? { firstName } : "First Name"
          }
          value={firstName}
          setValue={setFirstName}
        />
        <CustomInput
          placeholder={
            lastName === null || undefined ? { lastName } : "Last Name"
          }
          value={lastName}
          setValue={setLastName}
        />
        <CustomInput
          placeholder={
            occupation === null || undefined ? { occupation } : "Occupation"
          }
          value={occupation}
          setValue={setOccupation}
        />
        <CustomInput
          placeholder={
            lookingFor === null || undefined ? { lookingFor } : "Looking For"
          }
          value={lookingFor}
          setValue={setLookingFor}
        />
        <FileInput onPress={onUploadResumePressed} />
        {completed && <Text style={{ color: "white" }}>Resume Stored!</Text>}
        <CustomButton text="Apply & Go Back" onPress={onSetDataPressed} />
        {isSignedIn === !!!authentication.currentUser && (
          <CustomButton text="Sign Out" onPress={onSignOutPressed} />
        )}
        <Text style={styles.text}>{interestStore}</Text>
      </View>
    </ScrollView>
  );
};

// styles
const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    padding: 50,
  },
  text: {
    maxWidth: 200,
    flexGrow: 1,
    alignSelf: "center",
    justifyContent: "center",
  },
});
export default ProfileScreen;
