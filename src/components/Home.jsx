import React from 'react'
import Timer from './timer/Timer'
import { auth, provider } from '../database/firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import Button from '@mui/material/Button';
import SignIn from './SignIn'

const Home = () => {
    const [user] = useAuthState(auth)

  return (
    <>
        {
            user ? (
                <>
                    <UserInfo></UserInfo>
                    <Timer></Timer>
                    <SignOutBotton></SignOutBotton>
                </>
                ) : (
                    <>
                        <SignIn></SignIn>
                    </>
            )
        }
        
        
    </>
  )
}

export default Home

function SignOutBotton() {
    return (
        <Button variant="outlined" onClick={() => auth.signOut()}>Sign out</Button>
    )
}

function UserInfo() {
    return (
        <>
            <div className="userInfo">
                {/* <p>ようこそ、{auth.currentUser.displayName}さん。</p> */}
            </div>
        </>
    )
}