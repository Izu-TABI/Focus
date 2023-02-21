import React from 'react'
import  DiscordIcon  from '../images/discord_icon.png'

const Other = () => {
  return (
    <>
        <div className="text-center come-our-discord main-contents-area">
            <span className="dicord-title">Discord</span>
            <a href="https://discord.gg/uwtS6Ucf"><img src={DiscordIcon} alt="" style={{width: '10vh', height: '10vh'}}/></a>
        </div>
    </>
  )
}

export default Other