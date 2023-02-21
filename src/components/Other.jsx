import React from 'react'
import  DiscordIcon  from '../images/discord_icon.png'

const Other = () => {
  return (
    <>
        <div className="text-center come-our-discord">
            <span className="dicord-title">Discord</span>
            <img src={DiscordIcon} alt="" style={{width: '10vh', height: '10vh'}}/>
        </div>
    </>
  )
}

export default Other