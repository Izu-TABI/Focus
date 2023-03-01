import { doc, getDoc } from 'firebase/firestore'
import { db, auth } from '../../database/firebase'
import React, { useEffect, useState } from 'react'
import { updateTodayTotal } from '../../database/updateTodayTotal'
import { getDatabaseInfo } from '../../database/getDatabaseInfo'
import AWeekGraph from '../Graph/AWeekGraph'


const UserInfo = () => {
    const [time, setTime] = useState(0)
    const [todayTotal, setTodayTotal] = useState(0)

    updateTodayTotal()
    .then(() =>{
        getDatabaseInfo().then((data) => {
            setTime(data.totalTime)
            setTodayTotal(data.todayTotal)
        })
    })
    

    return (
        <>
            <div className="user-info-area">
                <p>
                <span>今日:</span>&nbsp;{Math.floor(todayTotal / 3600)}&nbsp;時間&nbsp;{Math.floor(todayTotal % 3600 / 60)}&nbsp;分 <br />
                <span>合計:</span>&nbsp;{Math.floor(time / 3600)}&nbsp;時間&nbsp;{Math.floor(time % 3600 / 60)}&nbsp;分 
                </p>
            </div>
        </>
    )
}

export default UserInfo