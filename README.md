# Click for Syria — Website

Landing page for the [Click for Syria](https://github.com/farissiddiqui/click-for-syria) Chrome extension.

**Live site:** https://clickforsyria.com

## Stack

Plain HTML + CSS + JS. No framework, no build step.

## Development

Open `index.html` directly in a browser, or use any static file server:

```bash
npx serve .
```

## Deployment

Deployed on Vercel. Any push to `main` auto-deploys.

## Before Launch Checklist

- [ ] Fill in Chrome Web Store URL in the two "Add to Chrome" links in `index.html`
- [ ] Fill in `SUPABASE_URL` and `SUPABASE_ANON_KEY` in `main.js`
- [ ] Confirm Supabase RLS is enabled (read-only anon access only)
- [ ] Point `clickforsyria.com` domain to Vercel in DNS settings
