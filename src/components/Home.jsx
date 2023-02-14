import React from 'react'
import Timer from './timer/Timer'
import { auth, provider } from '../database/firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import SignIn from './certification/SignIn'
import SignOutButton from './certification/SignOutButton'
import UserInfo from './certification/UserInfo'


const Home = () => {
    const [user] = useAuthState(auth)

  return (
    <>
        {
            user ? (
                <>
                    <UserInfo></UserInfo>
                    <Timer></Timer>
                    <SignOutButton></SignOutButton>
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
