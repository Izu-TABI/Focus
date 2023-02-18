import React from 'react'
import SignInButton from './certification/SignInButton'
import pencilImg from '../images/focus_pencil.png'

const Startpage = () => {
  return (
    <>  
        <div className="introduction text-center main-contents-area">
            <img src={pencilImg} alt="" className='pencil-img' />
            <p>Focusへようこそ。<br /> ”集中”をテーマに作られたアプリケーションです。<br />
            仲間同士で助け合い、高めあうことができます。
            </p>
            <p>サインインして作業を始めましょう。</p>
        </div>
        <SignInButton></SignInButton>
    </>
  )
}

export default Startpage