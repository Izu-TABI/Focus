import React, {useState} from 'react'
import CycleTimer, { intervalIds } from './CycleTimer';
import DigitalTimer, { digitalId, elapsedTime } from './DigitalTimer';
import Button from '@mui/material/Button';
import { update } from '../../database/update';

const Timer = () => {
  const [seconds, setSeconds] = useState('')
  const [paused, setPaused] = useState('')
  let hoursTemp;
  let minutesTemp;
  let inputSeconds = 0;

  const handleChangeHours = (e) => {
    if (isNaN(e.target.value)) {
      document.getElementById('input-hours').value = ''  
    } else {
      hoursTemp = e.target.value
    }
    
  }

  const handleChangeMinutes = (e) => {
    if (isNaN(e.target.value)) {
      document.getElementById('input-minutes').value = ''
    } else {
      minutesTemp = e.target.value
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    document.getElementById('input-hours').value = ''
    document.getElementById('input-minutes').value = ''
    document.getElementById('input-hours').style.display = 'none'
    document.getElementById('input-minutes').style.display = 'none'

    if (!hoursTemp) hoursTemp = 0
    if (!minutesTemp) minutesTemp = 0

    inputSeconds = (hoursTemp * 3600) + (minutesTemp * 60)  
    setSeconds(inputSeconds)
    setPaused(true)
    document.getElementById('start').style.display = 'none'
    document.getElementById('reset').style.display = 'block'
    document.getElementById('digital-timer').style.display = 'block'
  }

  const handleReset = () => {
    document.getElementById('input-hours').style.display = 'block'
    document.getElementById('input-minutes').style.display = 'block'
    document.getElementById('digital-timer').style.display = 'none'

    update(elapsedTime)
    clearInterval(digitalId)
    clearInterval(intervalIds)
    setPaused(false)
  }
  
  
  return (
    <>
      <div className="text-center">
        <CycleTimer seconds={seconds} paused={paused}></CycleTimer>
      </div>
        <div>
          <form className='form-area'>
            <div>
              <input type="text" name="hour" value={hoursTemp} onChange={handleChangeHours} className='form-control mx-auto' id='input-hours' autoComplete="off" placeholder='hours'/>
            </div>
            <div>
              <input type="text" name="minutes" value={minutesTemp} onChange={handleChangeMinutes} className='form-control mx-auto' id='input-minutes' autoComplete="off" placeholder='minutes'/>
            </div>
          </form>
        </div>
      <div className="text-center">
        <DigitalTimer seconds={seconds} paused={paused}></DigitalTimer>
        <Button variant="contained" onClick={() => {handleReset()}} id='reset' className="mx-auto">保存</Button>
        <Button variant="contained" type="submit" onClick={(e) => {handleSubmit(e)}} id='start' className="mx-auto">開始</Button>
      </div>
    </>
  )    
}

export default Timer