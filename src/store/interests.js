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
    const getDocument = async () => {
      // Get the userProfile doc
      const docRef = doc(db, "userProfiles", authentication.currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        this.interests = docSnap.get("interests");
      }
    };
    getDocument();
    return this.interests;
  }

  async setInterests(interestsParam) {
    await updateDoc(doc(db, "userProfiles", authentication.currentUser.uid), {
      interests: interestsParam,
    });
  }

  async clearInterests() {
    await updateDoc(doc(db, "userProfiles", authentication.currentUser.uid), {
      interests: "",
    });
    const getDocument = async () => {
      // Get the userProfile doc
      const docRef = doc(db, "userProfiles", authentication.currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        this.interests = docSnap.get("interests");
      }
    };
    getDocument();
    return this.interests;
  }

  get count() {
    return console.log(this.interests.length);
  }
}

export const interestsStore = new Interests();
