import { doc, updateDoc } from 'firebase/firestore';
import { db, auth } from './firebase';
import { getDatabaseInfo } from './getDatabaseInfo';



// 読み込み時にタイムスタンプと違ったら今日の合計時間を0にする
export async function updateTodayTotal() {

     //usersのdocumentを取得
    const userRef = doc(db, 'users', auth.currentUser.uid);

    // 日付を取得
    let date = new Date();
    let todayString = date.getFullYear() + "/" + date.getMonth() + "/" + date.getDate();
    let weekArray = [];
    let today = new Date().getDay()
    if (today === 0) {
        today = 6;
    } else {
        today -= 1;
    }


    getDatabaseInfo().then(async(database) => {
    // データベースのタイムスタンプと今日の日付を比較する

        if (database.timestamp !== todayString) {
            const oldDateArray = database.timestamp.split('/')
            const oldDate = new Date(oldDateArray[0], oldDateArray[1], oldDateArray[2]);
            const diffMilliSec = date - oldDate;
            const diffDays = parseInt(diffMilliSec / 1000 / 60 / 60 / 24);

            // console.log(diffDays);

            if (diffDays > 6) {
                for (let i = 0; i < 7; i++) {
                    if (weekArray[i] !== 0) {
                        weekArray[i] = 0;
                    }
                }    
            } else {
                weekArray = await database.aWeekTotalTime;
                for (let i = today; i < 7; i++) {
                    if (weekArray[i] !== 0) {
                        weekArray[i] = 0;
                    }
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