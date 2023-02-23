import React from 'react'
import UserInfo from './certification/UserInfo'
import AWeekGraph from './Graph/AWeekGraph'


const UserData = () => {
    return (
        <>
            <div className="main-contents-area">
                <h1 className='title-main text-center'>Data</h1>
                <UserInfo></UserInfo>
            </div>
        </>
    )
}

export default UserData