import React, {useEffect, useState} from 'react'

let intervalIds;
const CycleTimer = (props) => {
  intervalIds = new Array();
  const [intervalTimes, setIntervalTimes] = useState('')
  let id;
  let sita = 0

  useEffect(() => {
    const  element = document.getElementById('cycle-timer')
    let context = element.getContext('2d')
      context.beginPath();
      context.fillStyle = "red";
      context.arc(100, 100, 100, 0 * Math.PI / 180, 360 * Math.PI / 180, false);
 
      context.fill();
  })

  useEffect(() => {
    clearInterval(intervalIds);
    if (props.paused && intervalIds.length === 0) setIntervalTimes(props.seconds / 360 * 1000)
    else {
      clearInterval(intervalIds.shift())
      setIntervalTimes(0)
      document.getElementById('start').style.display = 'block'
      document.getElementById('reset').style.display = 'none'
    }
  }, [props.seconds, props.paused])
  
  useEffect(() => {
    const  element = document.getElementById('cycle-timer')
    let context = element.getContext('2d')
    sita = 0
    intervalIds.push(id = setInterval(() => {
      if (sita <= 360) {
        sita += 1
        context.beginPath();
        context.moveTo(100, 100);
        context.fillStyle = "lightgreen";
        context.arc(100, 100, 100, 0 * Math.PI / 180, sita * Math.PI / 180, false);
        context.fill();
      }
    }, (intervalTimes)))
    
  }, [intervalTimes])


  

  return (
    <>
        <canvas width="200" height="200" id="cycle-timer" className="canvas"></canvas>
    </>
  )
}

export default CycleTimer
export {intervalIds}