import React, {useState, useEffect} from 'react'

let digitalId;
const DigitalTimer = (props) => {

    const [time, setTime] = useState(0);

    useEffect(() => {
        if (props.paused) setTime(props.seconds)
        else {
            setTime(0)
            console.log(props.seconds - time) //経過時間
        }
        
        console.log(props.paused)
    }, [props.seconds, props.paused])


    useEffect(() => {
      digitalId = setInterval(() => {
        if (props.paused === false) clearInterval(digitalId);
        else if (time > 0) setTime(time - 1);
      }, 1000);
      return () => clearInterval(digitalId);
    }, [time]);

    return (
      <h3>残り時間: {Math.floor(time / 3600)}時間{Math.ceil(time % 3600 / 60)}分</h3>
    );
}

export default DigitalTimer
export {digitalId}