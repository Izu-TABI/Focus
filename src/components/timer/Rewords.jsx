import React, {useEffect} from 'react'

import { useReward } from 'react-rewards';


const Rewords = () => {
    const { reward, isAnimating} = useReward('rewardId', 'confetti', {elementCount: 300, lifetime: 6000, spread: 70});
    useEffect(() => {
        reward()
    }, [])
  return (
    <>
        <span id="rewardId"/>
        <big style={{fontSize: '50px', display: 'inline'}}>🎉</big>
    </>
  )
}

export default Rewords  