import React from 'react'
import  DiscordIcon  from '../images/discord_icon.png'

const Other = () => {
  return (
    <>
        <div className="text-center come-our-discord main-contents-area">
            <span className="dicord-title">Discord</span>
            <a href="https://discord.gg/uwtS6Ucf" rel="noreferrer noopener" target="_blank"><img src={DiscordIcon} alt="" style={{width: '10vh', height: '10vh'}}/></a>
        </div>
        <div className='text-center about-discord'>
          <h6>Discordでできること</h6>
          <ul>
            <li>
              皆の頑張りが見える
            </li>
            <li>
              質問し合うことができる
            </li>
          </ul>
          <br />
          上のアイコンから参加してください
        </div>
    </>
  )
}

export default Other