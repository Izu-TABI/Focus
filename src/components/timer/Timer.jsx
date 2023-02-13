import React, {useState, useEffect} from 'react'
import CycleTimer from './CycleTimer';


export default function Timer(props) {
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
    inputSeconds = (hoursTemp * 3600) + (minutesTemp * 60)

    console.log("inputHours:", hoursTemp)
    console.log("inputMinutes:", minutesTemp)
    console.log("inputSeconds:", inputSeconds)
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
          <input type="text" name="hour" value={hoursTemp} onChange={handleChangeHours}/>
        </div>
        <div>
          <input type="text" name="minutes" value={minutesTemp} onChange={handleChangeMinutes}/>
        </div>
        <button type="button" onClick={handleSubmit}>ボタン</button>
      </form>
      <CycleTimer seconds={inputSeconds}></CycleTimer>

    </>
  )    
}