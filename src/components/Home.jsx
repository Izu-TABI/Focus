import React from 'react'
import Timer from './timer/Timer'
import { auth, provider } from '../database/firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
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
