import { bestStreak } from './stats'
import { formatTotal } from './time'

const HOUR = 3600
const minutes = (seconds) => `${Math.floor(seconds / 60)}分`

// 称号。kind が 'session' のものは、その回の作業内容で判定する。
// progress を持つものは、まだ取れていないときに進み具合を表示する。
export const TITLES = [
  {
    id: 'first',
    name: 'はじめの一歩',
    description: 'はじめて記録する',
    unlocked: (data) => data.total > 0,
  },
  {
    id: 'focus30',
    name: '30分の壁',
    description: '1回で30分以上集中する',
    unlocked: (data) => data.longest >= 30 * 60,
    progress: (data) => ({ value: data.longest, goal: 30 * 60, format: minutes, label: '最長' }),
  },
  {
    id: 'immersed',
    name: 'のめり込み',
    description: '目標時間の2倍以上つづける',
    kind: 'session',
    unlocked: (_data, session) => session.target >= 5 * 60 && session.seconds >= session.target * 2,
  },
  {
    id: 'early',
    name: '朝活',
    description: '朝4時〜7時に集中をはじめる',
    kind: 'session',
    unlocked: (_data, session) => {
      const hour = new Date(session.startedAt).getHours()
      return session.seconds >= 60 && hour >= 4 && hour < 7
    },
  },
  {
    id: 'focus90',
    name: 'ディープワーク',
    description: '1回で90分以上集中する',
    unlocked: (data) => data.longest >= 90 * 60,
    progress: (data) => ({ value: data.longest, goal: 90 * 60, format: minutes, label: '最長' }),
  },
  streakTitle('streak3', '三日坊主卒業', 3),
  streakTitle('streak7', '習慣の芽', 7),
  streakTitle('streak30', '継続は力なり', 30),
  totalTitle('total10', 10),
  totalTitle('total100', 100),
  totalTitle('total1000', 1000),
]

function streakTitle(id, name, days) {
  return {
    id,
    name,
    description: `${days}日連続で記録する`,
    unlocked: (data) => bestStreak(data.daily) >= days,
    progress: (data) => ({
      value: bestStreak(data.daily),
      goal: days,
      format: (n) => `${n}日`,
      label: '最高',
    }),
  }
}

function totalTitle(id, hours) {
  return {
    id,
    name: `${hours}時間`,
    description: `累計${hours}時間集中する`,
    unlocked: (data) => data.total >= hours * HOUR,
    progress: (data) => ({ value: data.total, goal: hours * HOUR, format: formatTotal, label: '累計' }),
  }
}

export function findTitle(id) {
  return TITLES.find((title) => title.id === id)
}

// まだ持っていない称号のうち、条件を満たしたものの id を返す。
// session を渡したときだけ、その回の作業で判定する称号も評価する。
export function newlyUnlocked(data, session) {
  return TITLES.filter((title) => {
    if (data.titles[title.id]) return false
    if (title.kind === 'session') return session ? title.unlocked(data, session) : false
    return title.unlocked(data)
  }).map((title) => title.id)
}

// 最後に手に入れた称号（同じ日なら並び順で後のもの）
export function latestTitle(titles) {
  let latest = null
  TITLES.forEach((title, index) => {
    const date = titles[title.id]
    if (!date) return
    if (!latest || date > latest.date || (date === latest.date && index > latest.index)) {
      latest = { title, date, index }
    }
  })
  return latest?.title ?? null
}
