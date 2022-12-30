import { makeObservable, observable, action, toJS } from "mobx";
import { db } from "../../firebase/firebase-config";
import { collection, getDocs } from "firebase/firestore";
import { includes } from "lodash";

class Opportunities {
  opportunities = [];
  allDocIds = [];
  constructor() {
    makeObservable(this, {
      opportunities: observable,
      allDocIds: observable,
      getOpportunities: action,
      getMoreOpportunities: action,
    });
  }

  getOpportunities() {
    return new Promise((resolve, reject) => {
      const getDocument = () => {
        // Get the opportunities docs and filter them based on the userProfile docs
        getDocs(collection(db, "opportunities")).then((querySnapshot) => {
          // Create a new array to store the filtered opportunities docs
          try {
            const newDocs = [];
            let count = 0;
            querySnapshot.forEach((doc) => {
              if (count < 3) {
                newDocs.push({ ...doc.data(), id: doc.id });
                count++;
                this.allDocIds = [...this.allDocIds, doc.id]; // add the doc id to the allDocIds array
              }
            });
            // Randomize the array of docs
            newDocs.sort(() => Math.random() - 0.5);
            // Set the state with the newDocs array
            this.opportunities = newDocs;
            resolve(this.opportunities);
          } catch (error) {
            console.error(error);
            reject(error);
          }
        });
      };
      getDocument();
    });
  }

  getMoreOpportunities() {
    return new Promise((resolve, reject) => {
      const getDocument = () => {
        // Get the opportunities docs and filter them based on the userProfile docs
        getDocs(collection(db, "opportunities")).then((querySnapshot) => {
          try {
            // Create a new array to store the remaining opportunities docs that have not been loaded
            let remainingDocs = [];
            querySnapshot.forEach((doc) => {
              if (!includes(this.allDocIds, doc.id)) {
                remainingDocs.push({ ...doc.data(), id: doc.id });
              }
            });

            // Randomize the remaining docs array
            remainingDocs.sort(() => Math.random() - 0.5);

            // Retrieve 3 documents or the remaining number of documents if it is less than 3
            const threeOrRest =
              remainingDocs.length >= 3 ? 3 : remainingDocs.length;
            const nextDocs = remainingDocs.slice(0, threeOrRest);

            // Update the state with the new documents
            this.opportunities = [...this.opportunities, ...nextDocs];
            resolve(this.opportunities, this.allDocIds);

            this.allDocIds = [
              ...this.allDocIds,
              ...nextDocs.map((doc) => doc.id),
            ]; // Add the doc ids to the allDocIds array
          } catch (error) {
            console.error(error);
            reject(error);
          }
        });
      };
      getDocument();
    });
  }
}
export const opportunitiesStore = new Opportunities();
