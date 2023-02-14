import { doc , updateDoc} from 'firebase/firestore';
import {auth, db } from './firebase'
import { getDoc } from 'firebase/firestore'

export async function add(time) {
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

