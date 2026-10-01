// README の画像を作る。開発サーバー（npm run dev）を起動した状態で
//   node scripts/screenshots.js [http://localhost:5173]
// ヘッドレスの Chrome に架空のデモデータを入れて撮影し、docs/images/ に書き出す。
// 実際の画面やブラウザのデータは使わない。
import { spawn } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { Resvg } from '@resvg/resvg-js'

const BASE = process.argv[2] ?? 'http://localhost:5173'
const CHROME = process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PORT = 9333
const out = new URL('../docs/images/', import.meta.url)
mkdirSync(out, { recursive: true })

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// ---- 架空のデモデータ ----
function demoGuest(now) {
  const key = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  let seed = 11
  const random = () => (seed = (seed * 16807) % 2147483647) / 2147483647
  const daily = {}
  for (let i = 1; i < 330; i++) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    if (random() < 0.66) daily[key(d)] = Math.round((10 + random() * 130) * 60)
  }
  for (let i = 1; i <= 5; i++) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    daily[key(d)] = (25 + i * 11) * 60
  }
  daily[key(now)] = 45 * 60
  const total = Object.values(daily).reduce((a, b) => a + b, 0)
  return { total, daily, sessions: 318, longest: 112 * 60, titles: {}, goal: '英検2級に合格する' }
}

// ---- Chrome DevTools Protocol ----
async function launch() {
  const profile = mkdtempSync(join(tmpdir(), 'focus-shots-'))
  const chrome = spawn(CHROME, [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${profile}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--hide-scrollbars',
    '--mute-audio',
    'about:blank',
  ])
  for (let i = 0; i < 50; i++) {
    try {
      const targets = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json()
      const page = targets.find((target) => target.type === 'page')
      if (page) return { chrome, profile, page }
    } catch {
      // まだ起動中
    }
    await sleep(200)
  }
  throw new Error('Chrome を起動できませんでした')
}

function connect(url) {
  const socket = new WebSocket(url)
  let nextId = 0
  const pending = new Map()
  socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data)
    if (message.id && pending.has(message.id)) {
      const { resolve, reject } = pending.get(message.id)
      pending.delete(message.id)
      if (message.error) reject(new Error(message.error.message))
      else resolve(message.result)
    }
  })
  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const id = ++nextId
      pending.set(id, { resolve, reject })
      socket.send(JSON.stringify({ id, method, params }))
    })
  return new Promise((resolve) => socket.addEventListener('open', () => resolve({ send, close: () => socket.close() })))
}

async function shoot(cdp, { name, dir = out, path, width, height, mobile, scheme, setup, wait = 900 }) {
  await cdp.send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 2, mobile })
  await cdp.send('Emulation.setTouchEmulationEnabled', { enabled: mobile })
  await cdp.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: scheme }] })
  await cdp.send('Page.navigate', { url: `${BASE}/` })
  await sleep(600)
  // デモデータを入れてから目的のページを開き直す
  await cdp.send('Runtime.evaluate', {
    expression: `(() => { localStorage.clear(); ${setup}; })()`,
  })
  await cdp.send('Page.navigate', { url: `${BASE}${path}` })
  await sleep(wait)
  const { data } = await cdp.send('Page.captureScreenshot', { format: 'png' })
  const file = new URL(`${name}.png`, dir)
  writeFileSync(file, Buffer.from(data, 'base64'))
  if (dir === out) console.log(`  ${name}.png`)
  return file
}

const now = new Date()
const guest = JSON.stringify(demoGuest(now))
const settings = (minutes) => JSON.stringify({ minutes, sound: false, notify: false, notifyAsked: true, keepAwake: true, theme: 'system' })
const session = (target, elapsedSeconds, alerted) =>
  JSON.stringify({ id: 'demo', target, segments: [{ start: Date.now() - elapsedSeconds * 1000, end: null }], alerted })

const { chrome, profile, page } = await launch()
const work = new URL(`file://${profile}/`)
const cdp = await connect(page.webSocketDebuggerUrl)
await cdp.send('Page.enable')
console.log('撮影しています…')
try {
  const phone = { width: 390, height: 844, mobile: true }
  const idle = await shoot(cdp, {
    name: 'timer',
    dir: work,
    path: '/',
    ...phone,
    scheme: 'light',
    setup: `localStorage.setItem('focus:guest', ${JSON.stringify(guest)}); localStorage.setItem('focus:settings', ${JSON.stringify(settings(30))})`,
  })
  const running = await shoot(cdp, {
    name: 'running',
    dir: work,
    path: '/',
    ...phone,
    scheme: 'light',
    setup: `localStorage.setItem('focus:guest', ${JSON.stringify(guest)}); localStorage.setItem('focus:settings', ${JSON.stringify(settings(30))}); localStorage.setItem('focus:session', ${JSON.stringify(session(1800, 1123, true))})`,
    wait: 1500,
  })
  // 目標達成の直後（紙吹雪が舞っているところ）
  const reached = await shoot(cdp, {
    name: 'reached',
    dir: work,
    path: '/',
    ...phone,
    scheme: 'dark',
    setup: `localStorage.setItem('focus:guest', ${JSON.stringify(guest)}); localStorage.setItem('focus:settings', ${JSON.stringify(settings(30))}); localStorage.setItem('focus:session', ${JSON.stringify(session(1800, 1801, false))})`,
    wait: 1500,
  })
  await shoot(cdp, {
    name: 'stats',
    path: '/stats',
    width: 1100,
    height: 1500,
    mobile: false,
    scheme: 'light',
    setup: `localStorage.setItem('focus:guest', ${JSON.stringify(guest)}); localStorage.setItem('focus:settings', ${JSON.stringify(settings(30))})`,
  })

  // 3台並べたヒーロー画像
  const phones = [idle, running, reached].map((file) => `data:image/png;base64,${readFileSync(file).toString('base64')}`)
  const w = 390
  const h = 844
  const gap = 48
  const pad = 64
  const width = pad * 2 + w * 3 + gap * 2
  const height = pad * 2 + h
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <rect width="${width}" height="${height}" fill="#e9e7e1"/>
    ${phones
      .map(
        (href, i) => `<image x="${pad + i * (w + gap)}" y="${pad}" width="${w}" height="${h}" href="${href}" xlink:href="${href}"/>
    <rect x="${pad + i * (w + gap) - 0.5}" y="${pad - 0.5}" width="${w + 1}" height="${h + 1}" fill="none" stroke="#c9c6bd"/>`,
      )
      .join('')}
  </svg>`
  writeFileSync(new URL('hero.png', out), new Resvg(svg, { fitTo: { mode: 'width', value: width } }).render().asPng())
  console.log('  hero.png')
} finally {
  cdp.close()
  chrome.kill()
  await sleep(300)
  rmSync(profile, { recursive: true, force: true })
}
