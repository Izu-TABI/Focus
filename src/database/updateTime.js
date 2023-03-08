import { doc , updateDoc } from 'firebase/firestore';
import { auth, db } from './firebase'
import { getDatabaseInfo } from './getDatabaseInfo';

//関数が呼び出された時に合計時間を更新
export async function updateTime(time) {
    try {
        const userRef = doc(db, 'users', auth.currentUser.uid)
        const day = new Date().getDay()
        let weekTimes = [7], totalTime = 0, todayTotal = 0;

        getDatabaseInfo().then((data) => {
            weekTimes = data.aWeekTotalTime
            totalTime = data.totalTime
            todayTotal = data.todayTotal
        }).then(() => {
            weekTimes[day - 1] = weekTimes[day - 1] + time
        }).then(async() => {
            
            const data = {
                totalTime: totalTime + time,
                todayTotal: todayTotal + time,
                aWeekTotalTime: weekTimes
            }

            if (data.totalTime) {
                await updateDoc(userRef, data)
            }
        })

    } catch (err) {
        window.location.href = '/error';
    }
}

