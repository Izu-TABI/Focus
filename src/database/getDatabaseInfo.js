import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db, auth } from './firebase'


// 読み込み時にタイムスタンプと違ったら今日の合計時間を0にする
export async function getDatabaseInfo() {

     //usersのdocumentを取得
    const userRef = doc(db, 'users', auth.currentUser.uid);
    const docSnap = await getDoc(userRef)
    const data = docSnap.data();
    return data;
}