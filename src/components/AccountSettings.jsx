import React, { useEffect, useState } from 'react';

import SignOutButton from './certification/SignOutButton';
import { doc , updateDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../database/firebase';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const AccountSettings = () => {
  
  const [nickName, setNickName] = useState();
  const [tmpNickName, setTmpNickName] = useState();
  useEffect(() => {
    (async() => {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      const docSnap = await getDoc(userRef); // データの取得
      setNickName(docSnap.data().nickName)
    })();
  })

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("submit", tmpNickName);      
  }

  return (
    <>
      <div className="text-center main-contents-area">
          <h1 className="title-main">Account</h1>
          <p>{nickName}</p>
        
          <form className="nickname-area">
            <TextField
              id="input-nickname"
              label="nickname"
              placeholder={nickName}
              onChange={(e) => { setTmpNickName(e.target.value); }}
            />
            <Button variant="contained" onClick={(e) => { handleSubmit(e) }} className='change-nickname'>変更</Button>
          </form>
          
          <SignOutButton></SignOutButton>
      </div>
    </>
  )
}

export default AccountSettings