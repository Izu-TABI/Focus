import React, { useEffect, useState } from 'react';

import SignOutButton from './certification/SignOutButton';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import { changeNickname } from '../database/changeNickname';
import { getDatabaseInfo } from '../database/getDatabaseInfo';
import { updateSendDiscord } from '../database/updateSendDiscord';
import { Tune } from '@mui/icons-material';
import AccountDeleteBtn from './certification/AccountDeleteBtn';

const AccountSettings = () => {
  const [handleChangeNickname, setHandleChangeNickname] = useState(false)
  const [changeDiscord, setChangeDiscord] = useState(false)
  const [nickName, setNickName] = useState('未設定');
  const [tmpNickName, setTmpNickName] = useState();
  const [successMsg, setSuccessMsg] = useState('');
  //ニックネームが更新されたら
  useEffect(() => {
    getDatabaseInfo().then((data) => {
      setNickName(data.nickname)
    })
  }, [handleChangeNickname])



  // ニックネーム　更新ボタンが押されたら
  const handleSubmit = async (e) => {
    e.preventDefault();
    document.getElementById('input-nickname').value = '';
    document.getElementById('success-alert').style.display = 'block'
    const msg = await changeNickname(tmpNickName)
    setSuccessMsg(msg)
    setHandleChangeNickname(!handleChangeNickname)
  }

  // discordのチェックボックスが更新されたら
  const handleChangeDiscord = async (e) => {
    document.getElementById('success-alert').style.display = 'block'
    const msg = await updateSendDiscord(e.target.checked);
    setSuccessMsg(msg)
    setChangeDiscord(!changeDiscord)
  }

  return (
    <>
      <div className="main-contents-area user-setting-area" style={{ overflow: 'hidden' }}>
        <h4>{nickName}</h4>
        <div style={{ height: '50px', display: 'flex', alignItems: 'center' }}>
          <div style={{ backgroundColor: '#f1f8e9', width: '150px', height: '30px', borderRadius: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center', display: 'none' }} className="mx-auto" id='success-alert'>
            <small style={{ color: 'black', fontSize: '10px' }}>{successMsg}</small>
          </div>
        </div>

        <form className="nickname-area">
          <TextField
            sx={{ width: '200px' }}
            id="input-nickname"
            label="ニックネーム"
            placeholder={nickName}
            onKeyDown={(event) => {
              if (event.key === 'Enter')
                event.preventDefault();
            }}
            onChange={(e) => { setTmpNickName(e.target.value); }}
          />
          <Button variant="contained" onClick={(e) => { handleSubmit(e) }} className='change-nickname' sx={{ height: '50px', width: '10px', backgroundColor: '#1C9BF0' }}>変更</Button>
        </form>

        <div className='signout-btn'>
          <SignOutButton></SignOutButton>
        </div>

        <div className='account-delete-btn'>
          <AccountDeleteBtn></AccountDeleteBtn>
        </div>
      </div>
    </>
  )
}

export default AccountSettings
