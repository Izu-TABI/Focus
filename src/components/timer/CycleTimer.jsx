import React, {useEffect} from 'react'

const CycleTimer = (props) => {
  let intervalId;

  useEffect(() => {
    const  element = document.getElementById('cycle-timer')
    let context = element.getContext('2d')

    context.beginPath();
    context.moveTo(150, 150)
    context.fillStyle = "red";
    context.arc(150, 150, 100, 0 * Math.PI / 180, 360 * Math.PI / 180, false);
    context.fill();

    let sita = 0

    intervalId = setInterval(() => {
      if (sita <= 360) {
        sita += 1
        context.beginPath();
        context.moveTo(150, 150);
        context.fillStyle = "lightgreen";
        
        context.arc(150, 150, 100, 0 * Math.PI / 180, sita * Math.PI / 180, false);
        context.fill();
      } else {
        clearInterval(intervalId)
        return;
      }
    }, (props.seconds / 360 * 1000))
    
  }, [props.seconds])

  return (
    <>
      <div>
        
      </div>
    </>
  )
}

export default CycleTimer