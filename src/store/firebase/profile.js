import { makeObservable, observable, action, computed } from "mobx";
import { authentication, db } from "../../../firebase/firebase-config";
import { updateDoc, doc, getDoc } from "firebase/firestore";

class Profile {
  birthday = "";
  constructor() {
    makeObservable(this, {
      birthday: observable,
      getBirthday: action,
    });
  }

  getBirthday() {
    return new Promise((resolve, reject) => {
      const getDocument = async () => {
        try {
          // Get the userProfile doc
          const docRef = doc(
            db,
            "userProfiles",
            authentication.currentUser.uid
          );
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            this.birthday = docSnap.get("birthday");
            resolve(this.birthday);
          }
        } catch (error) {
          console.error(error);
          reject(error);
        }
      };
      getDocument();
    });
  }

  async setBirthday(birthdayParam) {
    await updateDoc(doc(db, "userProfiles", authentication.currentUser.uid), {
      birthday: { date: birthdayParam },
    });
  }
  async setBirthdaySkipped(birthdaySkippedParam) {
    await updateDoc(doc(db, "userProfiles", authentication.currentUser.uid), {
      birthday: { skippedOn: birthdaySkippedParam },
    });
  }
}

export const profileStore = new Profile();
