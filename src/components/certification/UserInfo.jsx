import { doc, getDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { db, auth } from '../../database/firebase'


const UserInfo = () => {
    const [time, setTime] = useState(0)

    useEffect(() => {
        const userRef = doc(db, 'users', auth.currentUser.uid)
        getDoc(userRef).then((docSnap) => {
            setTime(docSnap.data().totalTime)
        })
    }, [])

    return (
        <>
            <div className="userInfo text-center">
                <p className='welcome-msg'>こんにちは、{auth.currentUser.displayName}さん。</p> 
                {/* 合計{Math.floor(time / 3600)}時間{Math.floor(time % 3600 / 60)}分の勉強時間です。 */}
            </div>
        </>
    )
}

export default UserInfo