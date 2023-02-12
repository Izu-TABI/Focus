import React, {useEffect} from 'react'


const CycleTimer = (props) => {
  const sec = props.time
  useEffect(() => {
    const  element = document.getElementById('cycle-timer')
    let context = element.getContext('2d')

    context.beginPath();
    context.moveTo(150, 150)
    context.fillStyle = "red";
    context.arc(150, 150, 100, 0 * Math.PI / 180, 360 * Math.PI / 180, false);
    context.fill();

    let sita = 0
    setInterval(() => {
      sita += 1
      context.beginPath();
      context.moveTo(150, 150)
      context.fillStyle = "lightgreen";
      context.arc(150, 150, 100, 0 * Math.PI / 180, sita * Math.PI / 180, false);
      context.fill();
      if (sita === 360) {
        alert("1分経過")
      }
    }, (sec * 60))


    

  }, [])
  return (
    <div>hello</div>
  )
}

export default CycleTimer