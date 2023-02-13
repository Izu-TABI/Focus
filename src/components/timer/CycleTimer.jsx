import React, {useEffect} from 'react'


const CycleTimer = (props) => {
  console.log(props.seconds)
  useEffect(() => {

    const  element = document.getElementById('cycle-timer')
    let context = element.getContext('2d')

    context.clearRect(0, 0, element.width, element.height)
    context.beginPath();
    context.moveTo(150, 150)
    context.fillStyle = "red";
    context.arc(150, 150, 100, 0 * Math.PI / 180, 360 * Math.PI / 180, false);
    context.fill();

    let sita = 0
    let intervalId = setInterval(() => {
      sita += 1
      if (sita === 360) {
        context.clearRect(150, 150, element.width, element.height)
        clearInterval(intervalId)
      }
      context.beginPath();
      context.moveTo(150, 150);
      context.fillStyle = "lightgreen";

      context.arc(150, 150, 100, 0 * Math.PI / 180, sita * Math.PI / 180, false);
      context.fill();
    }, (props.seconds / 360 * 1000))
  }, [props.seconds])

  return (
    <div></div>
  )
}

export default CycleTimer