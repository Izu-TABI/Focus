import React, { useEffect, useState } from 'react'
import CycleTimer, { intervalIds } from './CycleTimer';
import DigitalTimer, { digitalId, elapsedTime } from './DigitalTimer';
import Button from '@mui/material/Button';
import { updateTime } from '../../database/updateTime';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

const Timer = () => {
  const [seconds, setSeconds] = useState('')
  const [paused, setPaused] = useState(false)
  const [hoursTemp, setHoursTemp] = useState('')
  const [minutesTemp, setMinutesTemp] = useState('')
  let inputSeconds = 0;

  const handleChangeHours = (e) => {
    if (isNaN(e.target.value)) {
      document.getElementById('input-hours').value = ''
    } else {
      setHoursTemp(e.target.value)
    }

  }

  const handleChangeMinutes = (e) => {
    if (isNaN(e.target.value)) {
      document.getElementById('input-minutes').value = ''
    } else {
      setMinutesTemp(e.target.value)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // document.getElementById('select-form-area').style.display = 'none'

    // document.getElementById('input-hours').value = ''
    // document.getElementById('input-minutes').value = ''

    // document.getElementById('input-hours').style.display = 'none'
    // document.getElementById('input-minutes').style.display = 'none'

    // document.getElementById('cycle-timer').style.marginTop = '17vh'

    document.getElementById('start').style.display = 'none'
    document.getElementById('reset').style.display = 'block'

    document.getElementById('digital-timer').style.display = 'block'

    document.querySelector('.bottom-nav').style.display = 'none'

    document.querySelector('.side-nav').style.display = 'none'

    if (!hoursTemp) setHoursTemp(0)
    if (!minutesTemp) setMinutesTemp(0)

    inputSeconds = (hoursTemp * 3600) + (minutesTemp * 60)

    setSeconds(inputSeconds)
    setPaused(true)
  }

  const handleReset = () => {
    // document.getElementById('select-form-area').style.display = 'block'
    // document.getElementById('custom-form-area').style.display = 'none'

    // document.getElementById('input-hours').style.display = 'block'
    // document.getElementById('input-minutes').style.display = 'block'

    document.getElementById('digital-timer').style.display = 'none'

    document.querySelector('.bottom-nav').style.display = 'block'
    document.querySelector('.side-nav').style.display = 'block'

    document.getElementById('start').style.display = 'block'
    document.getElementById('reset').style.display = 'none'

    updateTime(elapsedTime)
    clearInterval(digitalId)
    setPaused(false)
  }


  const [select, setSelect] = useState('');
  const handleSelectChange = (e) => {
    setSelect(e.target.value)
    if (e.target.value === 'custom') {
      document.getElementById('custom-form-area').style.display = 'block'
      document.getElementById('select-form-area').style.display = 'none'
    } else {
      document.getElementById('custom-form-area').style.display = 'none'
      setMinutesTemp(e.target.value)
    }
  }

  return (
    <>
      <div style={{ overflow: 'hidden' }}>
        <div className="text-center">
          <CycleTimer seconds={seconds} paused={paused}></CycleTimer>
        </div>

        {/* <div style={{ textAlign: 'center' }} id='select-form-area'>
          <FormControl sx={{ m: 2, minWidth: 180 }}>
            <InputLabel id="demo-simple-select-autowidth-label" sx={{ color: 'gray' }}>作業時間</InputLabel>
            <Select
              labelId="demo-simple-select-autowidth-label"
              id="demo-simple-select-autowidth"
              value={select}
              onChange={(e) => handleSelectChange(e)}
              label='作業時間'
            >
              <MenuItem value={5}>5分</MenuItem>
              <MenuItem value={30}>30分</MenuItem>
              <MenuItem value={60}>60分</MenuItem>
              <MenuItem value={90}>90分</MenuItem>
              <MenuItem value="custom">カスタム</MenuItem>
            </Select>
          </FormControl>
        </div>
        <form className='form-area' id='custom-form-area' style={{ display: 'none' }}>
          <div>
            <input type="text" name="hour" value={hoursTemp} onChange={handleChangeHours} className='form-control mx-auto' id='input-hours' autoComplete="off" placeholder='hours' />
          </div>
          <div>
            <input type="text" name="minutes" value={minutesTemp} onChange={handleChangeMinutes} className='form-control mx-auto' id='input-minutes' autoComplete="off" placeholder='minutes' />
          </div>
        </form> */}

        <div className="text-center">
          <DigitalTimer seconds={seconds} paused={paused}></DigitalTimer>
          <Button variant="contained" onClick={() => { handleReset() }} id='reset' className="mx-auto" style={{ display: 'none' }} sx={{ backgroundColor: '#1C9BF0' }}>保存</Button>
          <Button variant="contained" type="submit" onClick={(e) => { handleSubmit(e) }} id='start' className="mx-auto" sx={{ backgroundColor: '#1C9BF0' }}>開始</Button>
        </div>
      </div>
    </>
  )
}

export default Timer
