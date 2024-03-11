import React, { useEffect } from 'react'
import Timer from './timer/Timer'
import { auth } from '../database/firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import Startpage from './StartPage'
import { updateTodayTotal } from '../database/updateTodayTotal'
import Loading from './Loading'

const Home = () => {
    const [user, initialising] = useAuthState(auth);
    let content = <Loading />
    if (initialising) {
        content = <Loading />
        setTimeout(() => { }, 1000);
    } else if (user) {
        content = <Timer />;
        updateTodayTotal();
    } else if (!user) {
        content = <Startpage />;
    }
    useEffect(() => {
        if (!user) {
            document.querySelector('.bottom-nav').style.display = 'none'
            document.querySelector('.side-nav').style.display = 'none'
        } else {
            document.querySelector('.bottom-nav').style.display = 'block'
            document.querySelector('.side-nav').style.display = 'block'
        }
    }, [user]);


    return (
        <>
            <div className="main-contents-area">
                {
                    content
                }
            </div>

        </>
    )
}

export default Home
