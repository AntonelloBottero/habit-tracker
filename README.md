Next + React Application to keep track of good and bad Habits. Data storage managed through IndexedDb (powered by Dexie).

## Getting Started

### Run the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### View the last release

[habit-tracker-snowy-phi.vercel.app](habit-tracker-snowy-phi.vercel.app)

## UX

The Habits Tracker consists of two main sections.

### Setup

On the first access the user is asked to:
- Provide a nickname
- Provide the Habits he wants to track

The user can then access the setup page anytime to:
- Delete existing Habits
- Add new Habits

### Calendar

In this page, which consists of a simple calendar monthly view, the user can keep track of its Habits:
- register a new Event
- check progress of each Habit on a monthly basis

## Resources

### Habit

Holds informations about the Habit to track, provided by user:
- title
- color
- granularity (affects Slots setup)

### Slot

A virtual time slot where user can schedule events. Slots are associated with Habits and are generated each month for the current month.

Slots allow you to track the progress of users' Habits over time.

### Event

Registers a progress with an Habit, at a given time. A registered Event takes up a Slot, which belongs the Habit the user wants to track.
