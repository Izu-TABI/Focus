import { doc , updateDoc } from 'firebase/firestore';
import { auth, db } from './firebase'

//関数が呼び出された時にニックネームを更新
export async function changeNickname(inputNickname) {
    try {
        const userRef = doc(db, 'users', auth.currentUser.uid)

        const data = {
            nickname: inputNickname,
        }

        if (data.nickname) {
            await updateDoc(userRef, data)
            return "👍 : 正常に変更されました";
        }

    } catch (err) {
        console.error("Error adding document: ", err);
        return "問題が発生しました";
    }
}

