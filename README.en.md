<p align="center">
  <img src="public/android-chrome-512x512.png" width="128" alt="Focus icon">
</p>

<h1 align="center">Focus</h1>

<p align="center">
  A work timer that starts with "just five minutes"<br>
  <a href="https://izu-focus.web.app/"><b>izu-focus.web.app</b></a> ・ English | <a href="README.md">日本語</a>
</p>

<p align="center">
  <img src="docs/images/hero.png" width="820" alt="Choosing a duration, the ring counting down while you work, and confetti when you reach your goal">
</p>

Focus lowers the bar to getting started and helps you keep going. Goals start at five minutes: tell yourself "just five minutes", and you often find yourself still focused thirty minutes or an hour later. The app UI is in Japanese.

## Features

- **Use it right away** — no sign-in needed. Records are saved in your browser; sign in with Google to move them to your account and sync across devices.
- **One tap to start** — pick 5, 15, 30, 60 or 90 minutes, or fine-tune anywhere from 1 to 240 minutes.
- **Stays out of your way** — navigation hides while you work and the buttons fade when you're not touching them. You can keep going past your goal.
- **Hard to miss** — confetti, a chime and a notification when you reach your goal, plus the time left in the tab title.
- **Survives reloads** — reload or close the tab and your session picks up where it left off. Works offline; records are sent when you're back online.
- **See your progress** — today, this week, streaks and lifetime totals, a weekly chart, a one-year heatmap and 11 titles to earn.
- Dark mode, and installable to your home screen (PWA).

<p align="center">
  <img src="docs/images/stats.png" width="720" alt="Records page with totals, a weekly chart, a one-year heatmap and titles">
</p>

## Development

Requires Node.js 22.12 or later. Trying sign-in locally uses the Firebase emulators, which need Java 21 or later.

```bash
npm install
npm run dev          # http://localhost:5173
npm test
npm run lint
npm run emulators    # Auth + Firestore emulators (in another terminal)
```

During development the app talks to the local emulators, never to production. To point it at a real Firebase project, put `VITE_FIREBASE_CONFIG='{...}'` in `.env.local` (git-ignored).

### Deploy

The app is hosted on Firebase Hosting (site `izu-focus`). The Firebase config is not stored in the repository or the build; in production it is loaded from Hosting's reserved `/__/firebase/init.json`.

```bash
npx firebase-tools@15 login   # first time only
npm run deploy
```

Security rules live in [`firestore.rules`](firestore.rules).

### Images

```bash
npm run og                                    # the social preview image (public/og.png)
npm run screenshots -- http://localhost:5173  # README screenshots (with the dev server running)
```

Screenshots are taken in headless Chrome with made-up demo data; nothing from your real screen or browser is used.

### Data

Each user's records live in a single Firestore document, `users/{uid}` (guests keep the same shape in localStorage): `totalTime`, `daily` (seconds per day), `sessions`, `longest`, `titles`, `goal`, and `ops` (IDs of applied operations, so a retried write is never counted twice). Documents from the 2023–2024 version are migrated automatically the first time they are opened.
