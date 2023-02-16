import React, { useEffect } from 'react'
import Timer from './timer/Timer'
import { auth, provider } from '../database/firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import UserInfo from './certification/UserInfo'
import Startpage from './StartPage'

const Home = () => {
    const [user] = useAuthState(auth)
    useEffect(() => {
        if (!user){
            document.querySelector('.bottom-nav').style.display = 'none'
        } else {
            document.querySelector('.bottom-nav').style.display = 'block'
        }
    }) 

  return (
    <>
        {
            user ? (
                <> 
                    <UserInfo></UserInfo>
                    <Timer></Timer>
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
