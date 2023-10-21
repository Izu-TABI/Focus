import React, { useState, useEffect } from 'react'

let digitalId;
let elapsedTime = 0;

const CycleTimer = (props) => {
  const [time, setTime] = useState(0);
  const [elapsedTimeState, setelapsedTimeState] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [now, setNow] = useState(`${new Date().getHours() + " "}` + ":" + `${" " + (new Date().getMinutes() < 10 ? "0" + new Date().getMinutes() : new Date().getMinutes())}`);



  // 時計
  setInterval(() => {
    const contents = `${new Date().getHours() + " "}` + ":" + `${" " + (new Date().getMinutes() < 10 ? "0" + new Date().getMinutes() : new Date().getMinutes())}`;
    setNow(contents);
  }, 1000);


  useEffect(() => {
    if (props.paused === false) { // 保存ボタンを押した時
      document.getElementById("circle-timer").style.backgroundImage = `conic-gradient(rgba(255, 0, 0, 0.5) 0deg, white 0deg)`;
    }
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
    // １秒ごとに更新
    digitalId = setInterval(() => {
      // 更新
      const circleAngle = (360 / (time)) * elapsedTime;
      document.getElementById("circle-timer").style.backgroundImage = `conic-gradient(rgba(255, 88, 133, 0.34) ${circleAngle}deg, white ${circleAngle}deg)`;

      let now = 0;
      //現在時刻
      now = new Date()
      //経過時間を算出
      elapsedTime = startTime === 0 ? 0 : Math.floor((now - startTime) / 1000)
      setelapsedTimeState(elapsedTime)

      if (props.paused === false || elapsedTime === props.seconds && circleAngle >= 360) {
        setStartTime(0)
        elapsedTime = 0
        clearInterval(digitalId)
      }
    }, 1000);

    return () => clearInterval(digitalId);
  }, [time]);

  return (
    <>
      <div className='timer-main'>
        <div className="circle-timer-wrap">
          <div id='circle-timer'>
            <div className="now-time-wrap">
              <div className='now-time'>{now}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CycleTimer
export { digitalId, elapsedTime }
