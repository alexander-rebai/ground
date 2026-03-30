# Ground — Build Log & Learnings

## What Ground Is

Ground is the place where you go when you did it, or when you're struggling to do it. Where you get clarity when you're stuck. Where you get proof when you're moving.

It is not a habit tracker. It is not a writing app. It is not productivity software.

It is a mirror.

---

## The Journey (What We Learned Building This)

### 1. The word "habit" is poison

We started with "habits." Six preset habits with emoji labels, checkboxes, a green checkmark when done. It looked like every habit tracker ever built. And every habit tracker ever built gets abandoned.

The shift to "promises" changed the entire energy. You don't "complete" a promise like a task. You honor it or you don't. That one word — promise — carries weight that "habit" never will.

**Lesson: Language is architecture. The words you use shape how people relate to the tool.**

### 2. A mirror is not a form

The first rebuild added an intention field, an energy selector, a writing textarea with voice input, an evening reflection with resistance tracking. It was thorough. It was well-built. And looking at it felt like looking at a form that wanted something from you.

The honest moment: "I'd rather take my notebook."

That's when it clicked. The notebook is for writing. Ground was trying to BE the writing practice, the reflection practice, the intention-setting practice — competing with something that will always win because it's physical, unstructured, and real.

**Lesson: A tool should do what nothing else can do. If something else does it better (the notebook), get out of the way.**

### 3. What a notebook can't do

A notebook can't:
- Show you that you've shown up 47 days straight
- Show you that you miss silence every time you stay up late
- Be in your pocket at 6am when you're deciding whether to get out of bed or scroll
- Accumulate structured proof of who you're becoming

That's Ground's lane. Not the writing. The counting. The patterns. The proof.

**Lesson: Find what only you can do. Do that. Nothing else.**

### 4. The day is an arc, not a checklist

The six promises aren't equal-weight items in a flat grid. They have a natural rhythm:

- **Morning (activation):** Rise with intention → Move → Write → Work
- **Evening (settling):** Sit in silence → Read

Recognizing this rhythm and building it into the UI — morning promises prominent in the AM, evening promises prominent in the PM — makes the check-in feel like following the arc of your day instead of filling out a report.

**Lesson: Structure should mirror reality. When it does, the tool feels alive instead of imposed.**

### 5. The intention bridge

The evening isn't just about marking what you did. It's about setting direction for tomorrow. "Tomorrow I will..." — one sentence, written tonight, shown tomorrow morning when you wake up and open Ground.

If you missed a day and there's no intention: *"No intention set. That's okay. Pick it up today. Become who you are."*

This bridges days together. Each day isn't isolated — it's connected to the next through your own words.

**Lesson: The most powerful features connect moments in time, not just capture them.**

### 6. Strip until it hurts, then stop

We deleted 8 files. The intention card, the energy card, the entire writing system (textarea, voice input, journal stream), the reflection card with its resistance inputs, the speech recognition hook. All of it — gone.

What remained: six promise buttons, a day count, and a mirror showing your patterns.

The Today view went from five cards stacked vertically to one focused interaction: tap what you kept. Thirty seconds. Done.

**Lesson: The features you remove define the product more than the features you add.**

---

## The Three Iterations

### Iteration 1: Habit Tracker → Promise Mirror
- "Habits" became "Promises"
- Preset habits became six core promises (locked, non-optional)
- Green checkmarks became warm accent fills (weight, not gamification)
- "Journal stream" became "Writing" with "What's true today?"
- "X day streak" became "Day X" (quiet count, no celebration)
- Added intention field, evening reflection, resistance tracking
- **Result:** Better language, better meaning, but still felt like a form

### Iteration 2: Added Responsive Design
- Two-column desktop layout (check-in left, writing right)
- CSS-only responsive with Tailwind `lg:` breakpoints
- History view with CSS columns for masonry layout
- **Result:** Looked good on desktop, but the underlying problem remained

### Iteration 3: Strip to the Bone
- Deleted: IntentionCard, EnergyCard, WritingCard, ReflectionCard, PromisesCard, HistoryView, useSpeech, speech types
- Created: TodayView (day arc with morning/evening rhythm), MirrorView (stats, streaks, patterns), analytics engine
- The Today view became 30-second check-in
- History became Mirror — stats, week grid, pattern detection
- Evening intention bridge connects days
- **Result:** Ground finally does what only Ground can do

---

## What We Built (Final Architecture)

### The Today Tab — 30-Second Check-In
- Yesterday's intention shown at top (or encouraging message if none)
- Morning promises: Rise, Move, Write, Work (prominent in AM, muted in PM)
- Evening promises: Sit in silence, Read (muted in AM, prominent in PM)
- Quiet summary: "4 of 6"
- Evening: "Tomorrow I will..." input appears — the bridge to the next day
- Same screen, different visual weight based on time of day

### The Mirror Tab — What the Notebook Can't Do
- **Streak banner:** "Day 47" in large text. Longest streak below.
- **Promise stats:** Per-promise completion rate, current streak, longest streak, visual rate bar
- **Week grid:** 7-day dot matrix — rows are promises, columns are days. Filled dot = kept, empty = missed. At a glance.
- **Patterns:** Detected automatically when 14+ days of data exist. "You tend to miss Silence on Sundays." "Move has been perfect for 3 weeks." "Last time you broke the chain was 12 days ago."

### The Data Model
```
PromiseDef: { id, label, description, group: 'morning' | 'evening' }
DayData: { promises: Record<string, boolean>, at: number, intention?: string }
```

That's it. No energy scores. No stream entries. No journal. Promise kept: true. Promise missed: false. Intention: one sentence bridging tonight to tomorrow morning.

### The Six Promises
| # | Promise | Time | Description |
|---|---|---|---|
| 1 | Rise with intention | Morning | Out of bed, not drift |
| 2 | Move | Morning | Work out, get the body right |
| 3 | Write | Morning | Daily, messy, honest |
| 4 | Work | Morning | Show up for the mission |
| 5 | Sit in silence | Evening | Meditate, come back to center |
| 6 | Read | Evening | Feed the mind |

### Tech Stack
- Next.js 16 + React 19 + Tailwind CSS 4
- Client-side only (localStorage)
- No database, no auth, no external APIs
- ~15 source files total

---

## What We Deliberately Did Not Build

- **Weekly reviews** — you'll do that naturally in conversation with Claude
- **Gamification** — no badges, no colors changing on completion %, no celebration animations
- **Social features** — no sharing, no leaderboards. This is a private mirror.
- **Writing/journaling** — the notebook handles this
- **Energy tracking** — you know how you feel
- **Resistance logging** — the patterns in the Mirror show resistance without you having to narrate it
- **Complex settings** — evening hour is configurable, that's it
- **Database/auth** — localStorage keeps it private and instant

---

## The Deeper Why

From the context document:

> *"I am not discovering who I am. I am done pretending I don't know."*

Ground exists because knowing who you are and showing up as that person are two different things. The knowing is done. The showing up is daily work.

The six promises are the architecture of that daily work. Not fifty things. Six. Done daily, they hold everything else up.

Resistance shows up as drinks, smoke, social media, sleeping late, numbing out. It's not the enemy — it's the compass, pointing at the work that needs doing. The amateur negotiates with resistance. The pro shows up anyway.

Ground doesn't fight resistance for you. It just makes the showing up visible. Day 1. Day 47. Day 200. The count is the mirror. The patterns are the truth. The intention bridge is the thread connecting who you were yesterday to who you'll be tomorrow.

> *"The first time I left an imprint without knowing it. This time I do it on purpose."*

---

## File Structure (Final)

```
src/
  app/
    page.tsx              — Root app, state management, view routing
    layout.tsx            — Meta: "Six promises. One mirror. Every day."
    globals.css           — Dark theme, warm accent (#cb8f5d)
  components/
    today/
      TodayView.tsx       — The day arc (morning/evening, intention bridge)
    mirror/
      MirrorView.tsx      — Streak banner, stats, week grid, patterns
      WeekGrid.tsx        — 7-day dot matrix
      PromiseStatRow.tsx  — Per-promise stat display
      PatternsList.tsx    — Detected pattern insights
    shell/
      Header.tsx          — "Ground" + "Day N"
      Tabs.tsx            — Today | Mirror | Export
    onboarding/
      WelcomeStep.tsx     — "Six promises. One mirror. Every day."
      PromisePicker.tsx   — Core six locked + custom promises
    export/
      ExportView.tsx      — JSON/Markdown export + settings
    ui/
      Toast.tsx           — Notification system
  hooks/
    useStorage.ts         — localStorage sync hook
    useDayCount.ts        — Consecutive day counter
  lib/
    types.ts              — PromiseDef, DayData, PromiseStats, WeekDay
    constants.ts          — The six core promises
    analytics.ts          — Stats, patterns, streaks (pure functions)
    migration.ts          — v1→v2→v3 data migration
    export.ts             — JSON + Markdown export
    dates.ts              — Date formatting utilities
    storage.ts            — localStorage get/set
```
