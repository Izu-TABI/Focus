// 「1時間20分」「7日」のような文字列の、数字を大きく・単位を小さく表示する
export function Figure({ children, className = '' }) {
  const parts = String(children).split(/(\d+(?:\.\d+)?)/).filter(Boolean)
  return (
    <span className={`figure ${className}`}>
      {parts.map((part, i) =>
        /^\d/.test(part) ? (
          <span key={i}>{part}</span>
        ) : (
          <span key={i} className="unit">
            {part}
          </span>
        ),
      )}
    </span>
  )
}
