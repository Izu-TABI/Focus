import React from 'react'
import CycleTimer from './CycleTimer'

class Timer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hours: props.seconds / 3600,
      minutes: props.seconds % 3600 / 60,
      seconds: props.seconds % 60
    }
  }

  render() {
    return (
      <>
        <div>Timer</div>
        <canvas width="500" height="500" id="cycle-timer" className="canvas"></canvas>
  
        <CycleTimer time={this.state.hours * 3600 + this.state.minutes * 60 + this.state.seconds}></CycleTimer>
      </>
    )    
  }
}


export default Timer