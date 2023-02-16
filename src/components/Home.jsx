import React from 'react'
import Timer from './timer/Timer'
import { auth, provider } from '../database/firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import SignOutButton from './certification/SignOutButton'
import UserInfo from './certification/UserInfo'
import Test from './Test'
import Startpage from './StartPage'

const Home = () => {
    const [user] = useAuthState(auth)

  return (
    <>
        {
            user ? (
                <> 
                    <Test></Test>


                    <UserInfo></UserInfo>
                    <Timer></Timer>
                    <SignOutButton></SignOutButton>
                </>
                ) : (
                    <>
                        <Startpage></Startpage>
                    </>
            )
        }
        
        
    </>
  )
}

export default Home
