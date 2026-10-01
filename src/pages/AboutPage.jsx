import { Icon } from '../components/Icon'
import { Link } from '../lib/router'

export function AboutPage() {
  return (
    <article className="prose">
      <h1 className="page-title">Focus について</h1>
      <p className="lead">Focus は「とりあえず5分」から始める作業タイマーです。</p>
      <p>
        作業へのハードルを下げ、続けられるようにすることがこのアプリの目的です。「とりあえず5分だけやろう」と始めてみると、気付けば30分、1時間と集中できている——そんな状況を生み出すことを狙っています。作業時間を記録し、積み重ねを目で見られるようにすることで、続ける力にもなると考えています。
      </p>

      <h2>使い方</h2>
      <ol>
        <li>作業時間を選んで「はじめる」を押します。</li>
        <li>リングが一周したら目標達成です。そのまま続けることもできます。</li>
        <li>「終了」を押すと記録されます。「記録」から1週間・1年の積み重ねや称号を見られます。</li>
      </ol>
      <ul className="tips">
        <li>パソコンではスペースキーで開始・一時停止・再開ができます。</li>
        <li>「目標」を決めておくと、作業中にタイマーの下に表示されます。</li>
        <li>ログインしなくても使えます。ログインすると記録がほかの端末と同期されます。</li>
      </ul>

      <h2>ホーム画面に追加する</h2>
      <p>アプリのように全画面で使えます。iPhone では、ホーム画面に追加すると通知も使えるようになります。</p>
      <dl className="install-steps">
        <dt>iPhone / iPad</dt>
        <dd>Safari の共有ボタン →「ホーム画面に追加」</dd>
        <dt>Android</dt>
        <dd>Chrome のメニュー（⋮）→「ホーム画面に追加」または「アプリをインストール」</dd>
        <dt>パソコン</dt>
        <dd>Chrome や Edge のアドレスバーにあるインストールボタン</dd>
      </dl>

      <h2>フィードバック</h2>
      <p>
        不具合やご意見は{' '}
        <a href="https://github.com/Izu-TABI/Focus/issues" target="_blank" rel="noreferrer">
          GitHub の Issues
          <Icon name="external" className="inline-icon" />
        </a>{' '}
        か <a href="mailto:izutabi14@gmail.com">izutabi14@gmail.com</a> までお寄せください。
      </p>

      <p className="prose-footer">
        <Link to="/privacy-policy">プライバシーポリシー</Link>
        <span>© 2023–2026 Izu-TABI</span>
      </p>
    </article>
  )
}
