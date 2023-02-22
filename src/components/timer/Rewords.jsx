import React, {useEffect} from 'react'

import { useReward } from 'react-rewards';


const Rewords = () => {
    const { reward, isAnimating} = useReward('rewardId', 'confetti', {elementCount: 150, lifetime: 5000, spread: 60});
    useEffect(() => {
        reward()
    }, [])
  return (
    <>
        <span id="rewardId"/>
        <big style={{fontSize: '50px'}}>🎉</big>
    </>
  )
}

export default Rewords  