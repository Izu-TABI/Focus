import React from 'react'
import Button from '@mui/material/Button';
import { auth } from '../database/firebase'


const SignOutButton = () => {
    return (
        <Button variant="outlined" onClick={() => auth.signOut()}>Sign out</Button>
    )
}

export default SignOutButton