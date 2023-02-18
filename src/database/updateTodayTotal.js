import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db, auth } from './firebase'


// 読み込み時にタイムスタンプと違ったら今日の合計時間を0にする
export async function updateTodayTotal() {

     //usersのdocumentを取得
    const userRef = doc(db, 'users', auth.currentUser.uid)

    // 日付を取得
    let date = new Date()
    let todayString = date.getFullYear() + "/" + date.getMonth() + "/" + date.getDate()

    const data = {
        todayTotal: 0,
        timestamp: todayString,
    }

    const docSnap = await getDoc(userRef)

    // データベースのタイムスタンプと今日の日付を比較する
    if (docSnap.data().timestamp !== todayString) {
        await updateDoc(userRef, data)
    }
}