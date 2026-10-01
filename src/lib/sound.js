// 目標達成のチャイム。音声ファイルは使わず Web Audio で鳴らす。
let context = null

// iOS Safari ではユーザー操作の中で AudioContext を作る（再開する）必要があるので、
// 「はじめる」を押したときに呼んでおく
export function unlockAudio() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) return
    context ??= new AudioContext()
    if (context.state === 'suspended') context.resume()
  } catch {
    context = null
  }
}

export function playChime() {
  if (!context) unlockAudio()
  if (!context) return
  const start = context.currentTime + 0.05
  // ミ・ソ・ド の三和音をずらして鳴らす
  ;[659.25, 783.99, 1046.5].forEach((frequency, i) => {
    const time = start + i * 0.16
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    oscillator.type = 'sine'
    oscillator.frequency.value = frequency
    gain.gain.setValueAtTime(0.0001, time)
    gain.gain.exponentialRampToValueAtTime(0.22, time + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 1.4)
    oscillator.connect(gain).connect(context.destination)
    oscillator.start(time)
    oscillator.stop(time + 1.5)
  })
}
