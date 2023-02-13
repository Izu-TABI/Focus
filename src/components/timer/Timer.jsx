import React, {useState, useEffect} from 'react'
import CycleTimer from './CycleTimer';
import DigitalTimer from './DigitalTimer';


export default function Timer() {
  const [seconds, setSeconds] = useState('')
  const [paused, setPaused] = useState('')
  let hoursTemp;
  let minutesTemp;
  let inputSeconds = 0;

  const handleChangeHours = (e) => {
    hoursTemp = e.target.value
    console.log(hoursTemp)
  }

  const handleChangeMinutes = (e) => {
    minutesTemp = e.target.value
  }

  const handleSubmit = () => {
    if (!hoursTemp) hoursTemp = 0
    if (!minutesTemp) minutesTemp = 0

    inputSeconds = (hoursTemp * 3600) + (minutesTemp * 60)  
    setSeconds(inputSeconds)
    setPaused(true)
    document.getElementById('start').style.display = 'none'
    document.getElementById('reset').style.display = 'block'
  }

  const handleReset = () => {
    setPaused(false)
  }

  
  return (
    <>
      
      <div className="text-center"><canvas width="400" height="400" id="cycle-timer" className="canvas"></canvas></div>

      <form className='text-center'>
        <div>
          hour <br/>
          <input type="text" name="hour" value={hoursTemp} onChange={handleChangeHours} className='form-control mx-auto'/>
        </div>
        <div>
          minutes<br/>
          <input type="text" name="minutes" value={minutesTemp} onChange={handleChangeMinutes} className='form-control mx-auto'/>
        </div>
        <button type="button" onClick={() => {handleSubmit()}} id='start' className="mx-auto btn btn-primary">開始</button>
        <button onClick={() => handleReset()} id='reset' className="mx-auto btn btn-primary">リセット</button>
      </form>
      <CycleTimer seconds={seconds} paused={paused}></CycleTimer>
      <DigitalTimer seconds={seconds} paused={paused}></DigitalTimer>
      

    </>
  )    
}