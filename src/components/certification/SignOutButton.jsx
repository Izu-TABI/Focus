import React from 'react'
import Button from '@mui/material/Button';
import { auth } from '../../database/firebase'


const SignOutButton = () => {
    const signOut = () => {
        auth.signOut()
        window.location.reload()
    }
    return (
        <Button variant="outlined" onClick={() => {signOut()}} sx={{marginTop: '300px'}}>Sign out</Button>
    )
}

export default SignOutButton