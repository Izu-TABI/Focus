// Service Worker 経由で出した通知（Android やホーム画面に追加した iPhone）を押したときに、
// 開いている Focus のタブに戻る。なければ開く。
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      const client = clients.find((candidate) => 'focus' in candidate)
      return client ? client.focus() : self.clients.openWindow('/')
    }),
  )
})
