import React, {useState, useEffect} from 'react'

let digitalId;
let elapsedTime = 0;

const CycleTimer = (props) => {
    const [time, setTime] = useState(0);
    const [elapsedTimeState, setelapsedTimeState] = useState(0);
    const [startTime, setStartTime] = useState(0);

    
    useEffect(() => {
      const  element = document.getElementById('cycle-timer')
      let context = element.getContext('2d')
      
        
        if ( props.paused === false ) {
          context.fillStyle = "#e62e2e";
          context.arc(100, 100, 100, 0 * Math.PI / 180, 360 * Math.PI / 180, false);
          context.fill();
        }
      // })      
    }, [props.paused])

    //設定時間または開始、保存ボタンが押された場合
    useEffect(() => {

        if (props.paused) {
          setTime(props.seconds)
          setStartTime(new Date())
        }
        else {
            setTime(0)
        }
    }, [props.seconds, props.paused])

    // 設定時間が変更された場合
    useEffect(() => {
      const  element = document.getElementById('cycle-timer')
      let context = element.getContext('2d')

      // １秒ごとに更新
      digitalId = setInterval(() => {
        let now = 0;

        //現在時刻
        now = new Date()

        //経過時間を算出
        elapsedTime = startTime === 0 ? 0 : Math.floor((now - startTime) / 1000) 

        setelapsedTimeState(elapsedTime)

        context.beginPath();
        context.moveTo(100, 100);
        context.fillStyle = "lightgreen";
        context.arc(100, 100, 100, 0 * Math.PI / 180, (360 / (time)) * elapsedTime * Math.PI / 180, false);
        context.fill();

        if (props.paused === false || elapsedTime === props.seconds) {
          setStartTime(0)
          elapsedTime = 0          
          clearInterval(digitalId)
        }
      }, 1000);

      return () => clearInterval(digitalId);
    }, [time]);

    return (
        <>
          <canvas width="200" height="200" id="cycle-timer" className="canvas mx-auto"></canvas>
        </>
    );
}

export default CycleTimer
export {digitalId, elapsedTime} 