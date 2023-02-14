import React from 'react'
import { auth } from '../database/firebase'

const UserInfo = () => {
    return (
        <>
            <div className="userInfo">
                <p>ようこそ、{auth.currentUser.displayName}さん。</p>
            </div>
        </>
    )
    
}

export default UserInfo