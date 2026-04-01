# Mock Stats Design

**Date:** 2026-03-31

## Problem

The stats section (`#stats`) shows skeleton loaders indefinitely during beta because Supabase is not yet configured. This makes the site feel incomplete.

## Solution

When Supabase credentials are absent, render hardcoded mock stats using the existing `renderStat` / `animateCount` infrastructure so the count-up animation still plays.

## Change

In `main.js`, replace the early return in `loadStats()`:

```js
// Before
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return;

// After
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  renderStat('stat-emails', 163);
  renderStat('stat-posts', 91);
  renderStat('stat-users', 34);
  return;
}
```

## Mock values

| Stat | Value | Reasoning |
|---|---|---|
| Emails sent | 163 | Modest for a beta; non-round feels authentic |
| Posts generated | 91 | Slightly more than half of emails |
| Users who took action | 34 | Small but real-feeling early adopter count |

## Swap path

Fill in `SUPABASE_URL` and `SUPABASE_ANON_KEY` — the mock branch becomes dead code and real data takes over automatically.
