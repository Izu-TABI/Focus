import React, {useState, useEffect} from 'react'
import { add } from '../../database/add';

let digitalId;
let timeLimit;

const DigitalTimer = (props) => {
    const [time, setTime] = useState(0);

    useEffect(() => {
        if (props.paused) setTime(props.seconds)
        else {
            setTime(0)
        }
        
        console.log(props.paused)
    }, [props.seconds, props.paused])


    useEffect(() => {
      digitalId = setInterval(() => {
        if (props.paused === false || time === 0) {
            timeLimit = 0
            clearInterval(digitalId)
        } else if (time > 0) {
            setTime(time - 1)
            timeLimit = props.seconds - time + 1
        }
      }, 1000);
      return () => clearInterval(digitalId);
    }, [time]);

    return (
      <p id="digital-timer"><br/>残り時間: {Math.floor(time / 3600)}時間{Math.ceil(time % 3600 / 60)}分</p>
    );
}

export default DigitalTimer
export {digitalId, timeLimit}