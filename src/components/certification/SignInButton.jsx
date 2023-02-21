import React from 'react';
import { signInWithPopup } from 'firebase/auth'
import { add } from '../../database/add';
import { auth, provider } from '../../database/firebase';
import { db } from '../../database/firebase'; 
import { doc, getDoc } from 'firebase/firestore'
import GoogleButton from 'react-google-button'

function SignInButton() {

    const signInWithGoogle = async() => {
        await signInWithPopup(auth, provider)
        const docRef = doc(db, 'users', auth.currentUser.uid)
        const docSnap = await getDoc(docRef)
        if (!docSnap.exists()) {
            add()
            console.log('new account')
        } else {
            console.log('not a new account')
        }
    }
    

    return (
        <>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '5vh'}}>
                <GoogleButton onClick={signInWithGoogle}></GoogleButton>
            </div>
        </>
    )
}

export default SignInButton