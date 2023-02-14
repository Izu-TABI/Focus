import { signInWithPopup } from 'firebase/auth'
import React from 'react'
import Timer from './timer/Timer'
import { auth, provider } from '../database/firebase'
import { useAuthState } from 'react-firebase-hooks/auth'

const Home = () => {
    const [user] = useAuthState(auth)

  return (
    <>
        {
            user ? (
                <>
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
        <button onClick={signInWithGoogle}>
            <p>Googleでサインイン</p>
        </button>
    )
}

function SignOutBotton() {
    return (
        <button onClick={() => auth.signOut()}>
            <p>サインアウト</p>
        </button>
    )
}