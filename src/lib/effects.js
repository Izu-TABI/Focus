import { useEffect, useState } from 'react'
import { addDays, dateKey, startOfDay } from './time'

export function celebrate() {
  // 紙吹雪も画面と同じ墨・青・灰の色にする（テーマに合わせて CSS 変数から読む）
  const style = getComputedStyle(document.documentElement)
  const colors = ['--ink', '--accent', '--heat-2', '--bar'].map((name) => style.getPropertyValue(name).trim())
  import('canvas-confetti').then(({ default: confetti }) => {
    confetti({
      particleCount: 110,
      spread: 75,
      startVelocity: 36,
      ticks: 240,
      scalar: 0.9,
      origin: { y: 0.42 },
      colors,
      shapes: ['square'],
      disableForReducedMotion: true,
    })
  })
}

// 作業中に画面が消えないようにする（対応ブラウザのみ）
export function useWakeLock(enabled) {
  useEffect(() => {
    if (!enabled || !('wakeLock' in navigator)) return
    let lock = null
    let active = true
    const acquire = async () => {
      if (!active || lock || document.visibilityState !== 'visible') return
      try {
        const sentinel = await navigator.wakeLock.request('screen')
        if (!active) {
          sentinel.release()
          return
        }
        lock = sentinel
        lock.addEventListener('release', () => {
          lock = null
        })
      } catch {
        // 省電力モードなどで断られることがある
      }
    }
    acquire()
    document.addEventListener('visibilitychange', acquire)
    return () => {
      active = false
      document.removeEventListener('visibilitychange', acquire)
      lock?.release()
    }
  }, [enabled])
}

// タブのタイトルに残り時間などを出す
export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title
  }, [title])
}

// 「今日」の日付。日付が変わると再描画される（開きっぱなしで0時をまたいでも表示が更新される）
export function useToday() {
  const [today, setToday] = useState(() => new Date())
  useEffect(() => {
    const refresh = () => {
      const now = new Date()
      if (dateKey(now) !== dateKey(today)) setToday(now)
    }
    const untilTomorrow = addDays(startOfDay(today), 1).getTime() - Date.now()
    const timer = setTimeout(refresh, Math.max(1000, untilTomorrow + 1000))
    document.addEventListener('visibilitychange', refresh)
    return () => {
      clearTimeout(timer)
      document.removeEventListener('visibilitychange', refresh)
    }
  }, [today])
  return today
}
