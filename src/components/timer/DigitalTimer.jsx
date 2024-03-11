import React, { useState, useEffect } from 'react'
import { getDatabaseInfo } from '../../database/getDatabaseInfo';
import Rewords from './Rewords';
import sendCmpMsg from '../../bot/sendCmpMsg';

let digitalId;
let elapsedTime = 0;

const DigitalTimer = (props) => {
  const [time, setTime] = useState(0);
  const [elapsedTimeState, setelapsedTimeState] = useState(0);
  const [startTime, setStartTime] = useState(0);

  //設定時間または開始、保存ボタンが押された場合
  useEffect(() => {
    if (props.paused) {
      elapsedTime = 0
      setTime(props.seconds)
      setStartTime(new Date())
    } else {
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

      if (props.paused === false) {
        if (((props.seconds - elapsedTime) < 0) && props.seconds !== 0) {
          getDatabaseInfo().then((data) => {
            sendCmpMsg(data.nickname, elapsedTime, data.discordSendBool)
          })
        }


        setStartTime(0)
        clearInterval(digitalId)
      }
    }, 1000);

    return () => clearInterval(digitalId);
  }, [time]);
  return (
    <div id="digital-timer">
      {
        (((props.seconds - elapsedTime) < 0) && props.seconds !== 0 && elapsedTime !== 0 && props.paused) ? (
          <>
            <Rewords></Rewords>
            <>合計<br />&nbsp;{Math.floor((elapsedTimeState) / 3600) === 0 ? "" : Math.floor((elapsedTimeState) / 3600) + " " + "時間" + " "}{Math.ceil((elapsedTimeState) % 3600 / 60)}&nbsp;分&nbsp;{Math.ceil((elapsedTimeState) % 3600 % 60)}&nbsp;秒<br /></>

          </>
        ) : (
          <>
            {
              (props.seconds !== 0 && elapsedTime !== 0 && props.paused) ? (
                <>&nbsp;{Math.floor((props.seconds - elapsedTimeState) / 3600) === 0 ? "" : Math.floor((props.seconds - elapsedTimeState) / 3600) + " " + "時間" + " "}{Math.ceil((props.seconds - elapsedTimeState) % 3600 / 60)}&nbsp;分&nbsp;<br /></>
              ) : (
                props.now
              )
            }
          </>
        )

      }
    </div>
  );
}

export default DigitalTimer
export { digitalId, elapsedTime }
