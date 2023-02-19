import React from 'react'
import {useWindowSize} from 'react-use';
import Confetti from 'react-confetti'


export default () => {
  const { width, height } = useWindowSize()
  return (
    <Confetti
      width={width}
      height={height}
      numberOfPieces={80}
      drawShape={ctx => {
        ctx.beginPath()
        for(let i = 0; i < 22; i++) {
          const angle = 0.35 * i
          const x = 10
          const y = 10
          ctx.fillRect(0, 0, y, x)
        }
        ctx.stroke()
        ctx.closePath()
      }}
    />
  )
}