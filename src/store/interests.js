import { makeObservable, observable, action, computed } from "mobx";
import { authentication, db } from "../../firebase/firebase-config";
import { updateDoc, doc, getDoc } from "firebase/firestore";

class Interests {
  interests = "";
  constructor() {
    makeObservable(this, {
      interests: observable,
      getInterests: action,
      clearInterests: action,
      count: computed,
    });
  }

  getInterests() {
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
            this.interests = docSnap.get("interests");
            resolve(this.interests);
          }
        } catch (error) {
          console.error(error);
          reject(error);
        }
      };
      getDocument();
    });
  }

  async setInterests(interestsParam) {
    await updateDoc(doc(db, "userProfiles", authentication.currentUser.uid), {
      interests: interestsParam,
    });
  }

  clearInterests() {
    return new Promise((resolve, reject) => {
      try {
        updateDoc(doc(db, "userProfiles", authentication.currentUser.uid), {
          interests: {},
        }).then(() => {
          const getDocument = async () => {
            // Get the userProfile doc
            const docRef = doc(
              db,
              "userProfiles",
              authentication.currentUser.uid
            );
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              this.interests = docSnap.get("interests");
            }
          };
          getDocument();
          resolve(this.interests);
        });
      } catch (error) {
        console.error(error);
        reject(error);
      }
    });
  }

  get count() {
    return console.log(this.interests.length);
  }
}

export const interestsStore = new Interests();
