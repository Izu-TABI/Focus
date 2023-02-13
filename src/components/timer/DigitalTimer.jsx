import React, {useState, useEffect} from 'react'

const DigitalTimer = (props) => {

    const [time, setTime] = useState(0);

    useEffect(() => {
        setTime(props.seconds)
        console.log(props.paused)
    }, [props.seconds, props.paused])


    useEffect(() => {
      const id = setInterval(() => {
        if (props.paused === false) clearInterval(id);
        else if (time > 0) setTime(time - 1);
      }, 1000);
      return () => clearInterval(id);
    }, [time]);

    return (
      <h3>残り時間: {Math.floor(time / 3600)}時間{Math.ceil(time % 3600 / 60)}分</h3>
    );
}

export default DigitalTimer