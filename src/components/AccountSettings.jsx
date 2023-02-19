import React, { useEffect, useState } from 'react';

import SignOutButton from './certification/SignOutButton';
import { doc , updateDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../database/firebase';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { changeNickname } from '../database/changeNickname';

const AccountSettings = () => {
  
  const [nickName, setNickName] = useState();
  const [tmpNickName, setTmpNickName] = useState();
  const [successMsg, setSuccessMsg] = useState('');
  useEffect(() => {
    (async() => {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      const docSnap = await getDoc(userRef); // データの取得
      setNickName(docSnap.data().nickname)
    })();
  }, [successMsg])

  const handleSubmit = async(e) => {
    e.preventDefault();
    document.getElementById('input-nickname').value = '';
    const msg = await changeNickname(tmpNickName)
    setSuccessMsg(msg)
  }

  return (
    <>
      <div className="text-center main-contents-area">
          <h1 className="title-main">Account</h1>
          <p>{nickName}</p>
        

          <div style={{backgroundColor: '#f1f8e9', width: '150px', height: '30px', borderRadius: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center'}} className="mx-auto"> 
            <small style={{color: 'black',fontSize: '10px'}}>{successMsg}</small>
          </div>

          <form className="nickname-area">
            <TextField
              id="input-nickname"
              label="nickname"
              placeholder={nickName}
              onKeyDown={(event) => {
                if (event.key === 'Enter')
                  event.preventDefault();
              }}
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