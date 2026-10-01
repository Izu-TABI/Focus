import { load, save } from '../lib/storage'

// Firebase はログインまわりでしか使わないので、最初の表示が終わってから読み込む。
let loading = null
let loaded = null

export function loadFirebase() {
  loading ??= init().then(
    (services) => (loaded = services),
    (error) => {
      loading = null
      throw error
    },
  )
  return loading
}

// 読み込み済みなら同期的に返す（ポップアップをクリックの処理中に開くため）
export function firebaseIfLoaded() {
  return loaded
}

async function init() {
  const [{ initializeApp }, authModule, firestore, { config, emulators }] = await Promise.all([
    import('firebase/app'),
    import('firebase/auth'),
    import('firebase/firestore/lite'),
    resolveConfig(),
  ])
  const app = initializeApp(config)
  const auth = authModule.getAuth(app)
  auth.languageCode = 'ja'
  const db = firestore.getFirestore(app)
  if (emulators) {
    authModule.connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true })
    firestore.connectFirestoreEmulator(db, '127.0.0.1', 8080)
  }
  const provider = new authModule.GoogleAuthProvider()
  provider.setCustomParameters({ prompt: 'select_account' })
  return { auth, db, provider, authModule, firestore }
}

async function resolveConfig() {
  const env = import.meta.env
  if (env.VITE_FIREBASE_CONFIG) return { config: JSON.parse(env.VITE_FIREBASE_CONFIG), emulators: false }
  if (env.DEV || env.VITE_USE_EMULATORS === '1') {
    // ローカルでは Firebase エミュレーター（npm run emulators）につなぐ
    return { config: { apiKey: 'demo-key', authDomain: 'demo-focus.firebaseapp.com', projectId: 'demo-focus' }, emulators: true }
  }
  // Firebase Hosting はプロジェクトの設定をこの予約 URL で配信している。
  // 設定をリポジトリやビルドに埋め込まずに済む。
  try {
    const response = await fetch('/__/firebase/init.json')
    if (response.ok) {
      const config = await response.json()
      save('firebase-config', config)
      return { config, emulators: false }
    }
  } catch {
    // オフラインなら前回の設定を使う
  }
  const cached = load('firebase-config')
  if (cached) return { config: cached, emulators: false }
  throw new Error('Firebase の設定を読み込めませんでした')
}
