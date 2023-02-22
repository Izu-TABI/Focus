import React from 'react'
import { auth } from '../../database/firebase'
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import LogoutIcon from '@mui/icons-material/Logout';


const SignOutButton = () => {
    const signOut = () => {
        auth.signOut()
        window.location.reload()
    }
    return (
        <div onClick={() => {signOut()}} style={{fontSize: '20px', borderBottom: '1.5px solid #555555', width: '140px', height: '40px', margin: '0 auto'}} className='signout-btn'><LogoutIcon sx={{width: '30px', height: '30px'}}></LogoutIcon>&nbsp;&nbsp;Sign out</div>
    )
}

export default SignOutButton