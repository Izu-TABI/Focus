import React from 'react'
import SignInButton from './certification/SignInButton'
import pencilImg from '../images/focus_pencil.png'

const Startpage = () => {
  return (
    <>  
        <h1 className="text-center title-main">Focus</h1>
        <div className="introduction text-center main-contents-area">
            <img src={pencilImg} alt="" className='pencil-img' />
            <p>Focusへようこそ。<br /><br /> ”集中”をテーマに作られたアプリケーションです。<br /><br />
            作業を始めるハードルを下げ、継続できるような仕組みを取り入れました。</p><br /><br />
            <p> 詳しく知りたい方は<a href="https://github.com/Izu-TABI/Focus#readme">こちら</a>をご覧ください。</p><br /><br />
            <p>サインインして作業を始めましょう。</p>
            <SignInButton></SignInButton>
            <div style={{marginTop: '15px'}}>
              <a href="/privacy-policy" style={{fontSize:'15px', color: 'gray'}}>プライバシーポリシー</a>
            </div>

        </div>
    </>
  )
}

export default Startpage