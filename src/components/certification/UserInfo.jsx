import { doc, getDoc } from 'firebase/firestore'
import { db, auth } from '../../database/firebase'
import React, { useEffect, useState } from 'react'
import { updateTodayTotal } from '../../database/updateTodayTotal'


const UserInfo = () => {
    const [time, setTime] = useState(0)
    const [todayTotal, setTodayTotal] = useState(0)
    updateTodayTotal()

    useEffect(() => {
        const userRef = doc(db, 'users', auth.currentUser.uid) //usersのdocumentを取得

        getDoc(userRef).then((docSnap) => {//情報を取得
            setTime(docSnap.data().totalTime)
            setTodayTotal(docSnap.data().todayTotal)
        })
    }, [])

    return (
        <>
            <div className="user-info-area">
                Today:&nbsp;{Math.floor(todayTotal / 3600)}&nbsp;時間&nbsp;{Math.floor(todayTotal % 3600 / 60)}&nbsp;分 <br />
                Total:&nbsp;{Math.floor(time / 3600)}&nbsp;時間&nbsp;{Math.floor(time % 3600 / 60)}&nbsp;分 

            </div>
        </>
    )
}

export default UserInfo