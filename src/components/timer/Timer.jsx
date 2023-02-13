import React, {useState, useEffect} from 'react'
import CycleTimer from './CycleTimer';
import DigitalTimer from './DigitalTimer';


export default function Timer(props) {
  const [seconds, setSeconds] = useState('')
  const [paused, setPaused] = useState(false)
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
  }
  
  useEffect(() => {
    const element = document.getElementById('cycle-timer')
    let context = element.getContext('2d')

    context.beginPath();
    context.moveTo(150, 150)
    context.fillStyle = "red";
    context.arc(150, 150, 100, 0 * Math.PI / 180, 360 * Math.PI / 180, false);
    context.fill();
  }, [])
  
  return (
    <>
      <div>Timer</div>
      <canvas width="400" height="400" id="cycle-timer" className="canvas"></canvas>
      <form className='text-center'>
        <div>
          hour <br/>
          <input type="text" name="hour" value={hoursTemp} onChange={handleChangeHours}/>
        </div>
        <div>
          minutes<br/>
          <input type="text" name="minutes" value={minutesTemp} onChange={handleChangeMinutes}/>
        </div>
        <button type="button" onClick={() => {handleSubmit()}}>開始</button>
        <button type="button" onClick={()=>{window.location.reload()}}>リセット</button>
      </form>
      <CycleTimer seconds={seconds} paused={paused}></CycleTimer>
      <DigitalTimer seconds={seconds}></DigitalTimer>
      

    </>
  )    
}