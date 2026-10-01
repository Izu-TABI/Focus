// localStorage の薄いラッパー。プライベートブラウズなどで使えないときも落ちないようにする。
const PREFIX = 'focus:'

export function load(key, fallback = null) {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    return raw === null ? fallback : JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function save(key, value) {
  try {
    if (value === undefined || value === null) localStorage.removeItem(PREFIX + key)
    else localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch {
    // 容量オーバーや無効化されている場合は保存をあきらめる
  }
}

export function remove(key) {
  save(key, null)
}

// ほかのタブでの変更を受け取る
export function subscribe(keys, callback) {
  const wanted = new Set((Array.isArray(keys) ? keys : [keys]).map((key) => PREFIX + key))
  const handler = (event) => {
    if (event.key === null || wanted.has(event.key)) callback(event.key?.slice(PREFIX.length) ?? null)
  }
  window.addEventListener('storage', handler)
  return () => window.removeEventListener('storage', handler)
}

export function randomId() {
  return crypto.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}
