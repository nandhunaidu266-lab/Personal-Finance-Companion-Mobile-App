# Personal Finance Companion Mobile App

A cross-platform React Native (Expo) app that helps users understand and improve daily money habits.

## Features

- **Dashboard** with balance, income, expenses, savings progress, and category spend chart.
- **Transaction tracking** with add, edit, delete, search, and type filtering.
- **Goal feature** with monthly savings target and remaining amount tracking.
- **Insights** with top category, week-over-week spend, monthly totals, and expense frequency trends.
- **Mobile UX states** for loading, empty lists, and validation errors.
- **Local persistence** using AsyncStorage.

## Product Choices

- Built as a lightweight companion app, not a banking app.
- Fast-access bottom tab navigation for everyday usage.
- Focus on clarity: summary cards, concise labels, and guided forms.
- Data model keeps financial math centralized in a store for consistency.

## Tech Stack

- React Native + Expo
- TypeScript
- Zustand for state management
- AsyncStorage for local persistence

## Project Structure

```
src/
  components/
  data/
  screens/
  store/
  utils/
```

## Run Locally

```bash
npm install
npm run start
```

Open with Expo Go on Android/iOS, or use simulator targets.

## Notes / Assumptions

- Currency shown in USD.
- A single-user local profile is assumed.
- Goal progress uses: `savings = income - expenses`.
- Seed transactions are shown on first launch for demo clarity.
