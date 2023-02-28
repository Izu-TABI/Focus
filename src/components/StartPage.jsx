import React from 'react'
import SignInButton from './certification/SignInButton'
import pencilImg from '../images/focus_pencil.png'

const Startpage = () => {
  return (
    <>  
        <h1 className="text-center title-main">Focus</h1>
        <div className="introduction text-center main-contents-area">
            <img src={pencilImg} alt="" className='pencil-img' />
            <p>Focusへようこそ。<br /> ”集中”をテーマに作られたアプリケーションです。<br /></p>
            <p>作業を始めるハードルを下げ、継続できるような仕組みを取り入れました。</p>
            <p>サインインして作業を始めましょう。</p>
        </div>
        <SignInButton></SignInButton>
    </>
  )
}

export default Startpage