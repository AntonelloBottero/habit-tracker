# Habit Tracker

A Next.js habit tracker refactored around a pragmatic Domain-Driven Design structure.

## Architecture

The project uses a layered structure inspired by DDD, without enforcing a rigid theoretical model.

### Layers

Each feature is organized by bounded context:

- `src/habits`
- `src/events`
- `src/slots`
- `src/users`

Each context is split into:

- `domain` — entities and business rules
- `use-cases` — application orchestration
- `infrastructure` — persistence and external services
- `adapters` — UI/application coordination
- `mappers` — persistence/domain conversion

### Pragmatic DDD

The goal is to keep business logic explicit and infrastructure isolated, while staying practical in a React frontend.

This means:

- domain logic stays in the domain layer
- infrastructure remains behind gateways and adapters
- UI state remains pragmatic and presentation-oriented
- use cases orchestrate behavior without becoming over-abstracted

## Architecture decisions

### CRUD metadata in the domain

A key decision was to keep CRUD metadata such as `created_at` and `updated_at` inside the domain model.

Initially, these were treated as infrastructure concerns and excluded from the domain. In practice, that produced extra conversion layers and more complexity than value. The project now keeps those lifecycle fields as part of the model to avoid overengineering while preserving clarity.

This is a pragmatic trade-off: the domain remains focused on business rules, but it does not become artificially fragmented by metadata concerns that are part of the entity lifecycle.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Stack

- Next.js
- React
- TypeScript
- Dexie
- FullCalendar
- Tailwind CSS
