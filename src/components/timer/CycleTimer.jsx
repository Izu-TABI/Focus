import React, {useEffect, useState} from 'react'

const CycleTimer = (props) => {
  const [intervalTimes, setIntervalTimes] = useState('')
  let intervalIds = new Array();
  let id;
  let sita = 0

  useEffect(() => {
    const  element = document.getElementById('cycle-timer')
    let context = element.getContext('2d')
      context.beginPath();
      context.fillStyle = "red";
      context.arc(200, 200, 100, 0 * Math.PI / 180, 360 * Math.PI / 180, false);
 
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
        context.moveTo(200, 200);
        context.fillStyle = "lightgreen";
        context.arc(200, 200, 100, 0 * Math.PI / 180, sita * Math.PI / 180, false);
        context.fill();
      }
    }, (intervalTimes)))
    
  }, [intervalTimes])


  

  return (
    <>
      <div>
        
      </div>
    </>
  )
}

export default CycleTimer