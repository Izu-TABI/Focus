import React, {useState, useEffect} from 'react'

let digitalId;
let elapsedTime;

const DigitalTimer = (props) => {
    const [time, setTime] = useState(0);
    const [elapsedTimeState, setelapsedTimeState] = useState(0);
    const [startTime, setStartTime] = useState(0);

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
        let now = 0;

        //現在時刻
        now = new Date()

        //経過時間を算出
        elapsedTime = startTime === 0 ? 0 : Math.floor((now - startTime) / 1000) 

        setelapsedTimeState(elapsedTime)

        if (props.paused === false || elapsedTime === props.seconds) {
          setStartTime(0)
          clearInterval(digitalId)
        }
      }, 1000);

      return () => clearInterval(digitalId);
    }, [time]);

    return (
      <p id="digital-timer"><br/>残り: {Math.floor(time / 3600)}時間{Math.ceil(time % 3600 / 60)}分<br />{elapsedTimeState}</p>
    );
}

export default DigitalTimer
export {digitalId, elapsedTime} 