const SIZE = 300
const CENTER = SIZE / 2
const TICKS = 60
const OUTER = 146

// 時計の文字盤のような60本の目盛り。経過した分だけ目盛りが墨色になり、
// いま進んでいる位置の目盛りだけ青くなる。目標を超えたら全部が青になる。
//   state: 'idle' | 'running' | 'paused' | 'done'
export function Dial({ progress, state, children }) {
  const clamped = Math.min(Math.max(progress, 0), 1)
  const lit = state === 'idle' ? 0 : state === 'done' ? TICKS : Math.floor(clamped * TICKS)

  return (
    <div className="dial" data-state={state}>
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} aria-hidden="true">
        {Array.from({ length: TICKS }, (_, i) => {
          const major = i % 5 === 0
          const inner = OUTER - (major ? 17 : 9)
          const angle = (i / TICKS) * 2 * Math.PI
          const sin = Math.sin(angle)
          const cos = Math.cos(angle)
          let className = major ? 'tick is-major' : 'tick'
          if (i < lit) className += ' is-on'
          else if (i === lit && state === 'running') className += ' is-head'
          return (
            <line
              key={i}
              className={className}
              x1={CENTER + inner * sin}
              y1={CENTER - inner * cos}
              x2={CENTER + OUTER * sin}
              y2={CENTER - OUTER * cos}
            />
          )
        })}
      </svg>
      <div className="dial-center">{children}</div>
    </div>
  )
}
