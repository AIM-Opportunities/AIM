import {initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyAk9v-Nb_nHA0cG7NJ28Gs9gtZbFQUYxhM',
  authDomain: 'projectx-omar.firebaseapp.com',
  databaseURL: 'https://projectx-omar-default-rtdb.firebaseio.com',
  projectId: 'projectx-omar',
  storageBucket: 'projectx-omar.appspot.com',
  messagingSenderId: '601180425612',
  appId: '1:601180425612:web:8d11f41bd915be7678daa9',
  measurementId: 'G-MNLVR5XBV5',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const authentication = getAuth(app);
