import { doc , updateDoc, getDoc } from 'firebase/firestore';
import {auth, db } from './firebase'

export async function update(time) {
    try {
        const userRef = doc(db, 'users', auth.currentUser.uid)
        const docSnap = await getDoc(userRef) // データの取得
        const data = {
            totalTime: docSnap.data().totalTime + time
        }
        await updateDoc(userRef, data)
        console.log(docSnap.data().totalTime)
        console.log("Document written with ID: ", userRef.id);
    } catch (err) {
        console.error("Error adding document: ", err);
    }
}

