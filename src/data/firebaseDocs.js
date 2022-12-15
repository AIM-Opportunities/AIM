import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase-config";

const data = () => {
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    getDocs(collection(db, "opportunities")).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        // Push each document into the docs array and set the state with the updated array
        setDocs((docs) => [...docs, doc.data()]);
      });
    });
  }, []);

  return docs;
};

export default data;
