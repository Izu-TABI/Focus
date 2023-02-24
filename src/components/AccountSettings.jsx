import React, { useEffect, useState } from 'react';

import SignOutButton from './certification/SignOutButton';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { changeNickname } from '../database/changeNickname';
import { getDatabaseInfo } from '../database/getDatabaseInfo';

const AccountSettings = () => {
  const [handleChangeNickname, setHandleChangeNickname] = useState(false)
  const [nickName, setNickName] = useState('未設定');
  const [tmpNickName, setTmpNickName] = useState();
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    getDatabaseInfo().then((data) => {
      setNickName(data.nickname)
    })
  }, [handleChangeNickname])

  const handleSubmit = async(e) => {
    e.preventDefault();
    document.getElementById('input-nickname').value = '';
    document.getElementById('success-alert').style.display = 'block'
    const msg = await changeNickname(tmpNickName)
    setSuccessMsg(msg)
    setHandleChangeNickname(!handleChangeNickname)
  }

  return (
    <>
      <div className="main-contents-area user-setting-area"  style={{overflow: 'hidden'}}>
          <h4>{nickName}</h4>
          <div style={{backgroundColor: '#f1f8e9', width: '150px', height: '30px', borderRadius: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '30px',display: 'none'}} className="mx-auto" id='success-alert'> 
            <small style={{color: 'black',fontSize: '10px'}}>{successMsg}</small>
          </div>
        


          <form className="nickname-area">
            <TextField
              sx={{width: '150px'}}
              id="input-nickname"
              label="ニックネーム"
              placeholder={nickName}
              onKeyDown={(event) => {
                if (event.key === 'Enter')
                  event.preventDefault();
              }}
              onChange={(e) => { setTmpNickName(e.target.value); }}
            />
            <Button variant="contained" onClick={(e) => { handleSubmit(e) }} className='change-nickname' sx={{height: '50px', width: '10px', backgroundColor: '#1C9BF0'}}>変更</Button> 
          </form>
          <SignOutButton></SignOutButton>
      </div>
    </>
  )
}

export default AccountSettings