import React from 'react'

class Timer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hello: props.hello,
      world: props.world

    }
  }

  render() {
    return (
      <div>
        <div>Timer</div>
      </div>
    )
  }  

}



export default Timer