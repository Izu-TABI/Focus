export function notificationPermission() {
  return typeof Notification === 'undefined' ? 'unsupported' : Notification.permission
}

export async function requestNotifications() {
  if (typeof Notification === 'undefined') return 'unsupported'
  try {
    return await Notification.requestPermission()
  } catch {
    return Notification.permission
  }
}

export async function showNotification(title, body) {
  if (notificationPermission() !== 'granted') return
  const options = { body, tag: 'focus-goal', icon: '/android-chrome-192x192.png' }
  try {
    const notification = new Notification(title, options)
    notification.onclick = () => {
      window.focus()
      notification.close()
    }
    return
  } catch {
    // Android の Chrome やホーム画面に追加した iPhone では Service Worker 経由でしか出せない
  }
  try {
    const registration = await navigator.serviceWorker?.getRegistration()
    await registration?.showNotification(title, options)
  } catch {
    // 通知は補助なので、出せなくても続行する
  }
}
