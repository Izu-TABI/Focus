import React from 'react'
import  DiscordIcon  from '../images/discord_icon.png'

const Other = () => {
  return (
    <>
        <div className="text-center come-our-discord main-contents-area">
            <span className="dicord-title">Discord</span>
            <a href="https://discord.gg/Xse6NXKJM9" rel="noreferrer noopener" target="_blank"><img src={DiscordIcon} alt="" style={{width: '10vh', height: '10vh'}}/></a>
        </div>
        <div className='text-center about-discord'>
          <h6>Discordでできること</h6><br />
          <p>皆の頑張りが見える</p>
          <p>質問し合うことができる</p>
  
          <br />
          <p> ぜひ上のアイコンから参加してみてください。</p>
        </div>

        <div className='recomend-area text-center'>
          <span className='recomend-title text-center'>推奨事項</span><br />
          ホームに画面へのショートカットに対応しています。ぜひご利用ください。<br /><br /><br />
          <span className='sub-title'>iPhone</span><br />
          ①&nbsp;Safariの下部にある共有アイコンをタップ → ②「ホーム画面に追加」をタップ → ③&nbsp;右上の「追加」をタップ<br /><br /><br />
          <span className='sub-title'>Android</span> <br />
          ①&nbsp;ブックマークに追加 → ②&nbsp;ブックマークしたページを長押し → ③「ショートカットを作成」をタップ
        </div>

        <div className="feedback-area text-center">
          <span className="feedback-title">フィードバック</span><br />
          <p>不具合やご意見などは<a href="mailto:izutabi14@gmail.com">izutabi14@gmail.com</a>へよろしくお願い致します。</p>
        </div>
        <div style={{position: 'relative', display: 'flex', justifyContent: 'center'}}>
        <small style={{color: 'gray', fontSize: '10px',position: 'absolute', bottom: '0', marginBottom: '80px'}}>Copyright © 2023 Izu-TABI All rights reserved.</small>
        </div>
    </>
  )
}

export default Other