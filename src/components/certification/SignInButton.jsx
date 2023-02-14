import React from 'react';
import Button from '@mui/material/Button';
import { signInWithPopup } from 'firebase/auth'
import { add } from '../../database/add';
import { auth, provider } from '../../database/firebase';
import { db } from '../../database/firebase'; 
import { doc, getDoc } from 'firebase/firestore'

const newAccount = async() => {
    const docRef = doc(db, 'users', auth.currentUser.uid)
    const docSnap = await getDoc(docRef)
    if (!docSnap.exists()) {
        return true
    } else {
        return false
    }
}


function SignInButton() {
    const signInWithGoogle = async() => {
        await signInWithPopup(auth, provider)
        if (newAccount()) {
            add()
        }
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

export default SignInButton