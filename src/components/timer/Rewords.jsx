import React, { useEffect } from 'react'

import { useReward } from 'react-rewards';


const Rewords = () => {
  const { reward, isAnimating } = useReward('rewardId', 'confetti', { elementCount: 150, lifetime: 210, spread: 60 });
  useEffect(() => {
    reward();
  }, [])
  return (
    <>
      <span id="rewardId" />
    </>
  )
}

export default Rewords
