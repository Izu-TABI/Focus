import { doc , setDoc } from 'firebase/firestore';
import {auth, db } from './firebase'

export async function add() {
    try {
        let date = new Date()
        let todayString = date.getFullYear() + "/" + date.getMonth() + "/" + date.getDate()

        const userRef = doc(db, 'users', auth.currentUser.uid)
        const data = {
            userName: auth.currentUser.displayName,
            nickname: '未設定',
            totalTime: 0,
            todayTotal: 12,
            timestamp: "2022/11/1",
            aWeekTotalTime: {
                0: 0,
                1: 0,
                2: 0,
                3: 0,
                4: 0,
                5: 0,
                6: 0,
            }
        }
        await setDoc(userRef, data)
    } catch (err) {
        console.error("Error adding document: ", err);
    }
}
