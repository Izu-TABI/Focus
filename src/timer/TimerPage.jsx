import { useEffect } from 'react'
import { useSession } from '../data/session'
import { useStore } from '../data/store'
import { IdleView } from './IdleView'
import { RunningView } from './RunningView'
import { SummaryView } from './SummaryView'

export function TimerPage() {
  const { session, summary } = useSession()
  useSpaceKey()

  if (session) return <RunningView />
  if (summary) return <SummaryView />
  return <IdleView />
}

// スペースキーで開始・一時停止・再開（入力欄やボタンにフォーカスがあるときは除く）
function useSpaceKey() {
  const { session, paused, summary, start, pause, resume } = useSession()
  const { settings } = useStore()

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key !== ' ' || event.repeat || event.metaKey || event.ctrlKey || event.altKey) return
      if (event.target.closest?.('input, textarea, select, button, a, dialog')) return
      event.preventDefault()
      if (session) {
        if (paused) resume()
        else pause()
      } else if (!summary) {
        start(settings.minutes)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [session, paused, summary, start, pause, resume, settings.minutes])
}
