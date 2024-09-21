import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, set, get, remove } from "firebase/database";
import { v4 as uuidv4 } from 'uuid';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DB_URL,
  projectId: process.env.REACT_APP_FIREBASE_PJ_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getDatabase(app);

// auth
export function join({ email, pw }, callback) {
  createUserWithEmailAndPassword(auth, email, pw)
  .then((userCredential) => {
    const user = userCredential.user;
    callback(user);
  })
  .catch(console.error);
}

export async function login({ email, pw }) {
  return signInWithEmailAndPassword(auth, email, pw)
  .then(() => true)
  .catch((err) => {
    console.error(err);
    return false;
  });
}

export async function logout(callback) {
  return signOut(auth)
  .then(() => callback(null))
  .catch(console.error)
}

export function observeUser(callback) {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      // console.log(user);
      return callback(user);
    } else {
      console.error('세션 만료');
      return callback(null);
    }
  });
}

// db
export function saveDiary(uid, diary, diaryId) {
  const id = diaryId ? diaryId : uuidv4();

  return set(ref(db, `diary/${uid}/${id}`), {...diary, id})
}

export function deleteDiary(uid, id) {
  return remove(ref(db, `diary/${uid}/${id}`));
}

export async function getDiaries(uid) {
  return get(ref(db, `diary/${uid}`))
  .then((snapshot) => {
    if (snapshot.exists()) return Object.values(snapshot.val());
    return null;
  }).catch(console.error);
}