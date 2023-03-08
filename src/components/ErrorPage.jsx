import React from 'react'

const ErrorPage = () => {
  return (
    <div className="error-msg-area">
        <h2>失敗しました。</h2>
        <p>インターネットに接続されていることを確認し、リロードまたは、もう一度サインインしてみてください。</p>
        <p>お手数ですがよろしくお願いします。</p>
        <p>Izu-TABI</p>
        <a href="/">戻る</a>
    </div>
  )
}

export default ErrorPage