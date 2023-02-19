import React, {useEffect} from 'react'

import { useReward } from 'react-rewards';

const Rewords = () => {
    const { reward, isAnimating, elementCount} = useReward('rewardId', 'confetti', 0);
    useEffect(() => {
        reward()
    }, [])
  return (
        <span id="rewardId" />    
  )
}

export default Rewords  