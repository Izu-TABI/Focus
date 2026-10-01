// SNS で共有されたときのプレビュー画像（public/og.png）を作る。
//   npm run og
import { readFileSync, writeFileSync } from 'node:fs'
import { Resvg } from '@resvg/resvg-js'

const icon = readFileSync(new URL('../public/android-chrome-512x512.png', import.meta.url)).toString('base64')

const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#f4f3ef"/>
  <image x="110" y="175" width="288" height="288" href="data:image/png;base64,${icon}" xlink:href="data:image/png;base64,${icon}"/>
  <text x="470" y="300" font-family="Hiragino Sans, Noto Sans JP, sans-serif" font-weight="800" font-size="104" fill="#161616">Focus</text>
  <text x="474" y="380" font-family="Hiragino Sans, Noto Sans JP, sans-serif" font-weight="600" font-size="40" fill="#5b5a56">とりあえず5分から始める作業タイマー</text>
</svg>`

writeFileSync(
  new URL('../public/og.png', import.meta.url),
  new Resvg(svg, { font: { loadSystemFonts: true, defaultFontFamily: 'Hiragino Sans' } }).render().asPng(),
)
console.log('public/og.png を書き出しました')
