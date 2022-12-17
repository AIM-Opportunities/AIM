import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase-config";

const data = () => {
  const [docs, setDocs] = useState([]);
  useEffect(() => {
    getDocs(collection(db, "opportunities")).then((querySnapshot) => {
      // Create a new array to store the documents
      const newDocs = [];
      querySnapshot.forEach((doc) => {
        // Push each document into the newDocs array
        newDocs.push({ ...doc.data(), id: doc.id });
      });
      // Set the state with the newDocs array
      setDocs(newDocs);
    });
  }, []);
  // Return the docs state without resetting it
  return docs;
};
export default data;
