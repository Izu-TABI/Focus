import React, {useState} from 'react'
import CycleTimer, { intervalIds } from './CycleTimer';
import DigitalTimer, { digitalId, timeLimit } from './DigitalTimer';
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
  }

  const handleReset = () => {
    document.getElementById('input-hours').style.display = 'block'
    document.getElementById('input-minutes').style.display = 'block'

    update(timeLimit)
    clearInterval(digitalId)
    clearInterval(intervalIds)
    setPaused(false)
  }

  
  return (
    <>
      
      <div className="text-center"><canvas width="400" height="400" id="cycle-timer" className="canvas"></canvas></div>

      <form className='text-center'>
        <div>
          hour <br/>
          <input type="text" name="hour" value={hoursTemp} onChange={handleChangeHours} className='form-control mx-auto' id='input-hours' autoComplete="off"/>
        </div>
        <div>
          minutes<br/>
          <input type="text" name="minutes" value={minutesTemp} onChange={handleChangeMinutes} className='form-control mx-auto' id='input-minutes' autoComplete="off"/>
        </div>
        <Button variant="contained" type="submit" onClick={(e) => {handleSubmit(e)}} id='start' className="mx-auto">開始</Button>
        <Button variant="contained" onClick={() => {handleReset()}} id='reset' className="mx-auto">保存</Button>
      </form>
      <CycleTimer seconds={seconds} paused={paused}></CycleTimer>
      <DigitalTimer seconds={seconds} paused={paused}></DigitalTimer>
      

    </>
  )    
}

export default Timer