import { doc, updateDoc } from 'firebase/firestore';
import { db, auth } from './firebase';
import { getDatabaseInfo } from './getDatabaseInfo';

// ミリ秒を日に変換する(ms → days)
const convertMillisecToDays = (millisec) => {
    return parseInt(millisec / 1000 / 60 / 60 / 24);
}


// 読み込み時にタイムスタンプと違ったら今日の合計時間を0にする
export async function updateTodayTotal() {

    //usersのdocumentを取得
    const userRef = doc(db, 'users', auth.currentUser.uid);

    // 日付を取得
    let date = new Date();
    let todayString = date.getFullYear() + "/" + date.getMonth() + "/" + date.getDate();
    let weekArray = new Array(7).fill(0);
    let today = new Date().getDay();
    if (today === 0) {
        today = 6;
    } else {
        today -= 1;
    }


    getDatabaseInfo().then(async (database) => {
        // データベースのタイムスタンプと今日の日付を比較する

        if (database.timestamp !== todayString) {
            const oldDateArray = database.timestamp.split('/')
            const oldDate = new Date(oldDateArray[0], oldDateArray[1], oldDateArray[2]);
            const diffMilliSec = date - oldDate;
            const diffDays = convertMillisecToDays(diffMilliSec);

            if (diffDays < 6) {
                weekArray = await database.aWeekTotalTime;
                for (let i = today; i < 7; i++) {
                    weekArray[i] = 0;
                }
            }

            const data = {
                todayTotal: 0,
                timestamp: todayString,
                aWeekTotalTime: weekArray
            }
            await updateDoc(userRef, data);
        }
    })


}
