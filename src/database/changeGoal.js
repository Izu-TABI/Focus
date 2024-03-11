import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './firebase'

//関数が呼び出された時にニックネームを更新
export async function changeGoal(inputGoal) {
  try {
    const userRef = doc(db, 'users', auth.currentUser.uid)

    if (inputGoal) {
      await setDoc(userRef, {
        goal: inputGoal
      }, { merge: true });
      return "🎉 : 素晴らしい目標ですね！";
    }


  } catch (err) {
    console.error("Error adding document: ", err);
    window.location.href = '/error';
  }
}
