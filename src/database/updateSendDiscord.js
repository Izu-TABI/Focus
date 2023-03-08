import { doc , updateDoc } from 'firebase/firestore';
import { auth, db } from './firebase'
import { getDatabaseInfo } from './getDatabaseInfo';

//関数が呼び出された時に合計時間を更新
export async function updateSendDiscord(check) {
    try {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userRef, {discordSendBool: check})
        return "👍 : 正常に変更されました";
    } catch (err) {
        console.error("Error adding document: ", err);
        window.location.href = '/error';
        return "失敗しました";
    }
}

