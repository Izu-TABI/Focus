import { doc , setDoc } from 'firebase/firestore';
import {auth, db } from './firebase'

export async function add() {
    try {
        let date = new Date()
        let todayString = date.getFullYear() + "/" + date.getMonth() + "/" + date.getDate()

        const userRef = doc(db, 'users', auth.currentUser.uid)
        const data = {
            userName: auth.currentUser.displayName,
            totalTime: 0,
            todayTotal: 12,
            timestamp: "2022/11/1"
        }
        await setDoc(userRef, data)
    } catch (err) {
        console.error("Error adding document: ", err);
    }
}
