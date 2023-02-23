import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db, auth } from './firebase'
import { getDatabaseInfo } from './getDatabaseInfo'



// 読み込み時にタイムスタンプと違ったら今日の合計時間を0にする
export async function updateTodayTotal() {

     //usersのdocumentを取得
    const userRef = doc(db, 'users', auth.currentUser.uid)

    // 日付を取得
    let date = new Date()
    let todayString = date.getFullYear() + "/" + date.getMonth() + "/" + date.getDate()
    let weekArray = []
    const today = (date.getDay()) - 1



    getDatabaseInfo().then(async(database) => {
    // データベースのタイムスタンプと今日の日付を比較する

        if (database.timestamp !== todayString) {
            weekArray = await database.aWeekTotalTime;
            for (let i = today; i < 7; i++) {
                if (weekArray[i]) {
                    weekArray[i] = 0;
                }
            }
            
            const data = {
                todayTotal: 0,
                timestamp: todayString,
                aWeekTotalTime: weekArray
            }
            await updateDoc(userRef, data)
        }
    })

    
}