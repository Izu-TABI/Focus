import { signInWithPopup } from 'firebase/auth'
import React from 'react'
import Timer from './timer/Timer'
import { auth, provider } from '../database/firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import Button from '@mui/material/Button';

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
                        <SignInBotton></SignInBotton>
                    </>
            )
        }
        
        
    </>
  )
}

export default Home

function SignInBotton() {
    const signInWithGoogle = () => {
        signInWithPopup(auth, provider)
    }

    return (
        <>
            <div className='text-center'>
            <h5>Focusへようこそ。</h5>
            <Button variant="outlined" onClick={signInWithGoogle}>Google</Button>
            </div>
        </>
    )
}

function SignOutBotton() {
    return (
        <Button variant="outlined" onClick={() => auth.signOut()}>Sign out</Button>
    )
}

function UserInfo() {
    return (
        <>
            <div className="userInfo">
                <p>ようこそ、{auth.currentUser.displayName}さん。</p>
            </div>
        </>
    )
}