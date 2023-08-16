import React from 'react'
import '../styles/LoadingAnimation.css'

const Loading = () => {

  return (
    <>

      <div className='spinner-wrap'>
        <span>Focus</span>
        <div className="fulfilling-bouncing-circle-spinner">
          <div className="circle"></div>
          <div className="orbit"></div>
        </div>
      </div>
    </>
  )
}

export default Loading
