import { doc , updateDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase'

//関数が呼び出された時に合計時間を更新
export async function updateTime(time) {
    try {
        const userRef = doc(db, 'users', auth.currentUser.uid)
        const docSnap = await getDoc(userRef) // データの取得

        const data = {
            totalTime: docSnap.data().totalTime + time,
            todayTotal: docSnap.data().todayTotal + time
        }

        if (data.totalTime) {
            await updateDoc(userRef, data)
        }

    } catch (err) {
        console.error("Error adding document: ", err);
    }
}

