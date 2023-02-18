import React, { useEffect } from 'react'
import Timer from './timer/Timer'
import { auth } from '../database/firebase' 
import { useAuthState } from 'react-firebase-hooks/auth'
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
        <div className="main-contents-area">
        {
            user ? (
                <> 
                    <h1 className="text-center title-main">Focus</h1>
                    <Timer></Timer>
                </>
                ) : (
                    <>
                        <h1 className="text-center title-main">Focus</h1>
                        <Startpage></Startpage>
                    </>
            )
        }
        </div>
        
    </>
  )
}

export default Home
