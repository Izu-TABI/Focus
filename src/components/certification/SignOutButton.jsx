import React from 'react'
import { auth } from '../../database/firebase'
import LogoutIcon from '@mui/icons-material/Logout';


const SignOutButton = () => {
    const signOut = () => {
        auth.signOut()
        window.location.href = '/';
    }
    return (
        <div onClick={() => {signOut()}} style={{cursor: 'pointer',fontSize: '20px', borderBottom: '1.5px solid #d2cece', borderTop: '1.5px solid #d2cece', width: '140px', height: '60px', margin: '0 auto', display: 'flex', alignItems: 'center'}}><LogoutIcon sx={{width: '30px', height: '30px', justifyContent: 'center', marginLeft: '10px'}}></LogoutIcon>&nbsp;&nbsp;Sign out</div>
    )
}

export default SignOutButton