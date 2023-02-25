import { makeObservable, observable, action, computed } from "mobx";
import { authentication, db } from "../../../firebase/firebase-config";
import { updateDoc, doc, getDoc } from "firebase/firestore";

function sumIntegers(map) {
  let sum = 0;
  for (const value of Object.values(map)) {
    if (typeof value === "number") {
      sum += value;
    } else if (typeof value === "string") {
      const integers = value.split(":").map(str => parseInt(str.trim()));
      for (const integer of integers) {
        if (!isNaN(integer)) {
          sum += integer;
        }
      }
    }
  }
  return sum;
}
class Interests {
  interests = "";
  constructor() {
    makeObservable(this, {
      interests: observable,
      getInterests: action,
      clearInterests: action,
      totalStickingTime: computed,
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
          birthday: "",
        });
      } catch (error) {
        console.error(error);
        reject(error);
      }
    });
  }

  get totalStickingTime() {
    const interestsMap = this.interests;
    return sumIntegers(interestsMap);
  }
}

export const interestsStore = new Interests();
