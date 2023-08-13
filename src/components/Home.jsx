import React, { useEffect } from 'react'
import Timer from './timer/Timer'
import { auth } from '../database/firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import Startpage from './StartPage'
import { updateTodayTotal } from '../database/updateTodayTotal'

const Home = () => {
    const [user] = useAuthState(auth)
    updateTodayTotal()
    useEffect(() => {
        if (!user) {
            document.querySelector('.bottom-nav').style.display = 'none'
            document.querySelector('.side-nav').style.display = 'none'
        } else {
            document.querySelector('.bottom-nav').style.display = 'block'
            document.querySelector('.side-nav').style.display = 'block'
        }
    }, [user])

    return (
        <>
            <div className="main-contents-area">
                {
                    user ? (
                        <>
                            <Timer></Timer>
                        </>
                    ) : (
                        <>
                            <Startpage></Startpage>
                        </>
                    )
                }
            </div>

        </>
    )
}

export default Home
