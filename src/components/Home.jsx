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
            <button onClick={signInWithGoogle} className="btn btn-outline-primary">
                <p>Google</p>
            </button>
            </div>
        </>
    )
}

function SignOutBotton() {
    return (
        <button onClick={() => auth.signOut()} className="btn btn-outline-primary">
            <p>サインアウト</p>
        </button>
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