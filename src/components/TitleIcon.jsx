// 称号のアイコン。白黒のシルエットで、すべてこのファイルで描いている（24×24）。
const icons = {
  // はじめの一歩：足あと
  first: (
    <>
      <path d="M10.3 9.6c2.5-.4 4.4 1.4 4.6 4.2.2 2.3-.6 4.1-.8 5.9-.2 1.6-1.3 2.5-2.8 2.3-1.6-.2-2.3-1.4-2.5-3.1-.2-1.9-1.2-3.4-1.2-5.5 0-2.1.9-3.6 2.7-3.8Z" />
      <circle cx="14.3" cy="6.1" r="1.75" />
      <circle cx="11.2" cy="5" r="1.2" />
      <circle cx="8.8" cy="5.6" r="1.05" />
      <circle cx="7" cy="7.1" r=".95" />
      <circle cx="5.9" cy="9.1" r=".85" />
    </>
  ),
  // 30分の壁：れんがの壁
  focus30: (
    <path d="M2 3.5h6.2v3.9H2zM9.1 3.5h5.8v3.9H9.1zM15.8 3.5H22v3.9h-6.2zM2 8.3h3.1v3.9H2zM6 8.3h6v3.9H6zM12.9 8.3h6v3.9h-6zM19.8 8.3H22v3.9h-2.2zM2 13.1h6.2V17H2zM9.1 13.1h5.8V17H9.1zM15.8 13.1H22V17h-6.2zM2 17.9h3.1v3.9H2zM6 17.9h6v3.9H6zM12.9 17.9h6v3.9h-6zM19.8 17.9H22v3.9h-2.2z" />
  ),
  // のめり込み：うず
  immersed: (
    <path
      d="M12 12a1.5 1.5 0 0 1 3 0 3 3 0 0 1-6 0 4.5 4.5 0 0 1 9 0 6 6 0 0 1-12 0 7.5 7.5 0 0 1 15 0"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
  ),
  // 朝活：日の出
  early: (
    <>
      <path d="M5.5 17a6.5 6.5 0 0 1 13 0Z" />
      <path d="M1.5 18.6h21v2.2h-21z" />
      <path
        d="M12 3.2v3.3M4.6 7.4l2.3 2.3M19.4 7.4l-2.3 2.3M1.8 13.6h3M19.2 13.6h3"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </>
  ),
  // ディープワーク：的
  focus90: (
    <>
      <path
        fillRule="evenodd"
        d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20Zm0 2.4a7.6 7.6 0 1 0 0 15.2 7.6 7.6 0 0 0 0-15.2Z"
      />
      <path
        fillRule="evenodd"
        d="M12 6.4a5.6 5.6 0 1 1 0 11.2 5.6 5.6 0 0 1 0-11.2Zm0 2.4a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4Z"
      />
      <circle cx="12" cy="12" r="1.6" />
    </>
  ),
  // 三日坊主卒業：卒業帽
  streak3: (
    <>
      <path d="M12 3.5 23 8.6 12 13.7 1 8.6Z" />
      <path d="M5.6 11.4v4.4c0 1.8 2.9 3.3 6.4 3.3s6.4-1.5 6.4-3.3v-4.4L12 14.4Z" />
      <path d="M20.6 9.6v6.6" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M19.6 15.8h2l.6 3.4h-3.2Z" />
    </>
  ),
  // 習慣の芽：芽
  streak7: (
    <>
      <path d="M11.2 21.5v-8.7h1.6v8.7Z" />
      <path d="M11.6 13.6C11.6 9.1 8.3 6.4 3.4 6.4c0 4.6 3.3 7.2 8.2 7.2Z" />
      <path d="M12.4 11.8c0-5.2 3.5-8.3 8.6-8.3 0 5.4-3.4 8.3-8.6 8.3Z" />
      <path d="M6.5 20.2h11v1.8h-11z" />
    </>
  ),
  // 継続は力なり：山頂の旗
  streak30: (
    <>
      <path d="M1.5 21 9.2 8.8l3.6 5.6 2.6-3.4L22.5 21Z" />
      <path d="M9.2 9.2V2.4" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9.2 2.4 15 4.4l-5.8 2.1Z" />
    </>
  ),
  // 10時間：砂時計
  total10: (
    <>
      <path d="M4.5 2h15v2.2h-15zM4.5 19.8h15V22h-15z" />
      <path
        d="M7 4.2v2.4c0 2.5 2 4.3 4.4 5.4-2.4 1.1-4.4 2.9-4.4 5.4v2.4M17 4.2v2.4c0 2.5-2 4.3-4.4 5.4 2.4 1.1 4.4 2.9 4.4 5.4v2.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path d="M8.7 19.8c0-1.9 1.5-3.2 3.3-3.5 1.8.3 3.3 1.6 3.3 3.5ZM9.1 7.2h5.8c-.5 1.2-1.6 2.1-2.9 2.8-1.3-.7-2.4-1.6-2.9-2.8Z" />
    </>
  ),
  // 100時間：メダル
  total100: (
    <>
      <path d="M5.8 1.8h4.3l2.7 6.6H8.5ZM18.2 1.8h-4.3l-2.7 6.6h4.3Z" />
      <path
        fillRule="evenodd"
        d="M12 8.2a7 7 0 1 1 0 14 7 7 0 0 1 0-14Zm0 2.6.98 2.5 2.7.15-2.1 1.7.7 2.6-2.28-1.46-2.28 1.46.7-2.6-2.1-1.7 2.7-.15Z"
      />
    </>
  ),
  // 1000時間：トロフィー
  total1000: (
    <>
      <path d="M6.5 2.5h11v6.2a5.5 5.5 0 0 1-11 0Z" />
      <path
        d="M6.6 4.4H3.5v1.5a3.6 3.6 0 0 0 3.8 3.6M17.4 4.4h3.1v1.5a3.6 3.6 0 0 1-3.8 3.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path d="M10.9 13.8h2.2v3.4h-2.2zM8 17.2h8v1.9H8zM6.5 19.8h11v2.4h-11z" />
    </>
  ),
}

export function TitleIcon({ id, ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      {icons[id]}
    </svg>
  )
}

export const TITLE_ICON_IDS = Object.keys(icons)
