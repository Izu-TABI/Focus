import { doc , setDoc} from 'firebase/firestore';
import {auth, db } from './firebase'

export async function add() {
    try {
        
        const userRef = doc(db, 'users', auth.currentUser.uid)
        const data = {
            userName: auth.currentUser.displayName,
            totalTime: 0
        }
        await setDoc(userRef, data)
        console.log("Document written with ID: ", userRef.id);
    } catch (err) {
        console.error("Error adding document: ", err);
    }
}

