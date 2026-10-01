import { useSyncExternalStore } from 'react'
import { flushSync } from 'react-dom'

// ページ数が少ないので、ルーターは History API だけで十分
const listeners = new Set()

// スクロール位置はページを切り替えたあとに自分で先頭へ戻す（App.jsx）
if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'

function notify() {
  listeners.forEach((listener) => listener())
}

// 対応ブラウザでは View Transitions で前後のページをなめらかに切り替える
function transition(update) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!document.startViewTransition || reduceMotion || document.visibilityState !== 'visible') {
    update()
    return
  }
  document.startViewTransition(() => flushSync(update))
}

window.addEventListener('popstate', () => transition(notify))

function subscribe(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function usePath() {
  return useSyncExternalStore(subscribe, () => window.location.pathname)
}

export function navigate(to, { replace = false } = {}) {
  if (to === window.location.pathname) return
  const update = () => {
    window.history[replace ? 'replaceState' : 'pushState'](null, '', to)
    notify()
  }
  // 存在しないページからの置き換えなどは、そのまま切り替える
  if (replace) update()
  else transition(update)
}

export function Link({ to, children, onClick, ...props }) {
  const path = usePath()
  return (
    <a
      href={to}
      aria-current={path === to ? 'page' : undefined}
      onClick={(event) => {
        onClick?.(event)
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
          return
        }
        event.preventDefault()
        navigate(to)
      }}
      {...props}
    >
      {children}
    </a>
  )
}
