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
import { changeGoal } from '../database/changeGoal';

const AccountSettings = () => {
  const [handleChangeNickname, setHandleChangeNickname] = useState(false)
  const [changeDiscord, setChangeDiscord] = useState(false)
  const [nickName, setNickName] = useState('未設定');
  const [tmpNickName, setTmpNickName] = useState();
  const [tmpGoal, setTmpGoal] = useState();
  const [successMsg, setSuccessMsg] = useState('');
  const [goal, setGoal] = useState('');
  const [sendDiscord, setSendDiscord] = useState(false);

  useEffect(() => {
    getDatabaseInfo().then((data) => {
      setGoal(data.goal);
      setSendDiscord(data.discordSendBool);
      setNickName(data.nickname);
    })
  }, []);

  useEffect(() => {
    getDatabaseInfo().then((data) => {
      setSendDiscord(data.discordSendBool);
    })
  }, [changeDiscord]);

  // ニックネーム　更新ボタンが押されたら
  const handleSubmit = async (e) => {
    e.preventDefault();
    document.getElementById('input-nickname').value = '';
    document.getElementById('success-alert').style.display = 'block'
    const msg = await changeNickname(tmpNickName)
    setSuccessMsg(msg);
    setNickName(tmpNickName);
  }

  // 更新ボタンが押されたら
  const handleSettingGoal = async (e) => {
    e.preventDefault();
    document.getElementById('input-goal').value = '';
    document.getElementById('success-alert').style.display = 'block';
    const msg = await changeGoal(tmpGoal);
    console.log(tmpGoal, msg);
    setSuccessMsg(msg);
    setGoal(tmpGoal);
  }

  // discordのチェックボックスが更新されたら
  const handleChangeDiscord = async (e) => {
    document.getElementById('success-alert').style.display = 'block'
    const msg = await updateSendDiscord(e.target.checked);
    setSuccessMsg(msg);
    setChangeDiscord(!changeDiscord);
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

        <form className="input-area">
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

        <form className="input-area">
          <TextField
            sx={{ width: '200px' }}
            id="input-goal"
            label="目標"
            placeholder={goal}
            onKeyDown={(event) => {
              if (event.key === 'Enter')
                event.preventDefault();
            }}
            onChange={(e) => { setTmpGoal(e.target.value); }}
          />
          <Button variant="contained" onClick={(e) => { handleSettingGoal(e) }} className='change-nickname' sx={{ height: '50px', width: '10px', backgroundColor: '#1C9BF0' }}>設定</Button>
        </form>


        <div className='check-discord'>
          <div className='check-discord-contens'>
            <span className='text'>作業時間をDiscordへ送信</span>

            <div className="check-box-area">
              <Switch
                checked={sendDiscord}
                onChange={(e) => { handleChangeDiscord(e) }}
                inputProps={{ 'aria-label': 'controlled' }}
              />
            </div>
          </div>
        </div>

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
