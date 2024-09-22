import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut,
  onAuthStateChanged, reauthenticateWithCredential, deleteUser, EmailAuthProvider,
  updatePassword } from "firebase/auth";
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
export async function join({ email, pw }, callback) {
  return createUserWithEmailAndPassword(auth, email, pw)
  .then((userCredential) => {
    const user = userCredential.user;
    callback(user);
    return user.uid;
  })
  .catch(console.error);
}

export async function login({ email, pw }) {
  return signInWithEmailAndPassword(auth, email, pw)
  .then(() => true)
  .catch(() => false)
}

export async function logout(callback) {
  return signOut(auth)
  .then(() => callback(null))
  .catch(console.error)
}

export function observeUser(callback) {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      return callback(user);
    } else {
      console.error('세션 만료');
      return callback(null);
    }
  });
}

export async function reAuthUser(userProvidedPw) {
  const user = auth.currentUser;
  const credential = EmailAuthProvider.credential(user.email, userProvidedPw)

  return reauthenticateWithCredential(user, credential)
  .then((res) => res)
  .catch((err) => {
    console.error(err);
    return false;
  });
}

export async function withdrawalUser(userProvidedPw) {
  return reAuthUser(userProvidedPw)
  .then((res) => {
    if (res) {
      return deleteUser(res.user)
      .then(() => 200)
      .catch((error) => {
        console.error(error);
        return false;
      });
    }
    return 400;
  })
}

export async function updateUserPw(userProvidedPw, newPw) {
  return reAuthUser(userProvidedPw)
  .then((res) => {
    if (res) {
      return updatePassword(res.user, newPw)
      .then((res) => {
        console.log(res);
        return true;
      }).catch((err) => {
        console.error(err);
        return 400;
      });
    }
    return 401;
  })
}

// db
export function saveUser(uid, dogName) {
  if (uid) {
    return set(ref(db, `user/${uid}`), { dogName });
  }
}

export async function deleteUserAndDiaries(uid) {
  if (uid) {
    return remove(ref(db, `diary/${uid}`))
    .then(() => {
      remove(ref(db, `user/${uid}`))
    })
  }
}

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

export async function getDogName(uid) {
  return get(ref(db, `user/${uid}/dogName`))
  .then((snapshot) => {
    if (snapshot.exists()) return snapshot.val();
    return '';
  }).catch(console.error);
}
