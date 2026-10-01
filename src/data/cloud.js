import { applySession, fromCloud, mergeRecords, revertSession, toCloud } from '../lib/records'

// ログイン中の記録は「操作」を端末の送信待ち（outbox）に積んでから Firestore に送る。
// オフラインでも記録でき、つながったときに順番に反映される。
//   session  作業を1回記録する（id はセッションの id）
//   revert   直前の記録を取り消す
//   merge    ゲストの記録をアカウントへ引き継ぐ
//   goal     目標を変える
//   migrate  旧版のデータを新しい形で保存し直す
export function applyOp(record, op, now) {
  switch (op.type) {
    case 'session':
      return applySession(record, op.session, now).record
    case 'revert':
      return revertSession(record, op.session, now)
    case 'merge':
      return mergeRecords(record, op.record, now)
    case 'goal':
      return { ...record, goal: op.goal }
    default:
      return record
  }
}

export function applyOps(record, ops, now) {
  return ops.reduce((current, op) => applyOp(current, op, now), record)
}

// 反映済みの操作 id をいくつまで覚えておくか（再送で二重に足さないため）
const REMEMBERED_OPS = 50

function userRef(services, uid) {
  return services.firestore.doc(services.db, 'users', uid)
}

export async function fetchUserDoc(services, uid) {
  const snapshot = await services.firestore.getDoc(userRef(services, uid))
  return snapshot.exists() ? snapshot.data() : null
}

export function appliedOps(doc) {
  return Array.isArray(doc?.ops) ? doc.ops : []
}

// 操作を1件、トランザクションで反映する。返り値は反映後の記録。
export async function commitOp(services, user, op, now) {
  const ref = userRef(services, user.uid)
  return services.firestore.runTransaction(services.db, async (transaction) => {
    const snapshot = await transaction.get(ref)
    const doc = snapshot.exists() ? snapshot.data() : null
    const applied = appliedOps(doc)
    const current = fromCloud(doc, now)
    if (applied.includes(op.id)) return current

    // 取り消し対象がまだ反映されていなければ、取り消すものがない
    const skip = op.type === 'revert' && !applied.includes(op.session.id)
    const record = skip ? current : applyOp(current, op, now)
    const fields = { ...toCloud(record), ops: [...applied, op.id].slice(-REMEMBERED_OPS) }
    if (snapshot.exists()) transaction.update(ref, fields)
    else transaction.set(ref, { ...fields, userName: user.displayName ?? '', nickname: '' })
    return record
  })
}

export async function deleteUserDoc(services, uid) {
  await services.firestore.deleteDoc(userRef(services, uid))
}
