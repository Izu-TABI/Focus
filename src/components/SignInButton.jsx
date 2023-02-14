import React from 'react';
import { auth, provider } from '../database/firebase'
import Button from '@mui/material/Button';
import { signInWithPopup } from 'firebase/auth'
import { add } from '../database/add';


function SignInButton() {
     const signInWithGoogle = async() => {
        await signInWithPopup(auth, provider)
        add()
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