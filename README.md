# Hangout Invitation

A mobile-first, single-page invitation. Someone enters their name and date of birth, and if the date matches, they walk through a short romantic booking: yes, a kind of evening, a time, and a phone number. There is no backend. The finished site is a static build you can host on Netlify, Vercel, or GitHub Pages.

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

```bash
npm run build
npm run preview
```

`npm run build` typechecks with TypeScript, then writes `dist/`.

## The secret date

The gate compares the date picker value to `ALLOWED_DOB` in `src/config.js` as a `YYYY-MM-DD` string. It never parses that value with `Date`, so time zones cannot shift the day.

```js
export const ALLOWED_DOB = '1999-07-07'
```

Change that string to move the gate. The name can be anything. A wrong date goes to the invalid screen and does not reveal the correct day.

This check runs in the browser. It is a playful lock, not security. Anyone can read the value in the bundle.

## Copy

All visitor-facing strings, the date-type cards, the “No” replies, and the country codes live in `src/config.js`. Edit that file to change the wording without hunting through components.

## EmailJS

The send button calls `sendBooking()` in `src/services/email.js`. That function sends the invitation through EmailJS.

1. Create an account at [emailjs.com](https://www.emailjs.com/).
2. Add an email service (Gmail, Outlook, or another provider EmailJS supports).
3. Create a template. The send uses these variables:

   - `{{name}}` — guest name
   - `{{dob}}` — date of birth (`YYYY-MM-DD`)
   - `{{date_type}}` — selected card, for example `dinner — Dinner & Drinks`
   - `{{date_time}}` — a readable local date and time, plus the ISO timestamp
   - `{{phone}}` — E.164 number, for example `+971501234567`
   - `{{submitted_at}}` — ISO timestamp of the submit

   A simple template body:

   ```
   {{name}} said yes.

   Born: {{dob}}
   Plan: {{date_type}}
   When: {{date_time}}
   Phone: {{phone}}
   Sent: {{submitted_at}}
   ```

4. Copy the service ID, template ID, and public key into `.env`:

   ```
   VITE_EMAIL_SERVICE_ID=service_xxx
   VITE_EMAIL_TEMPLATE_ID=template_xxx
   VITE_EMAIL_PUBLIC_ID=your_public_key
   ```

5. In the EmailJS dashboard, restrict the public key to your site’s domains. The key is visible in the built JavaScript. Domain restriction is what keeps other sites from using it.
6. Restart `npm run dev` after changing `.env`.

If any EmailJS variable is missing, or the send fails, the form stays on this step and shows an error. A hidden honeypot field is ignored if a bot fills it. The submit button also ignores a second click while a send is in flight. Nothing is stored in `localStorage`. A refresh starts over.

To use Web3Forms or Formspree instead, replace the body of `sendBooking()` and keep the same argument and `{ ok: true | false }` result. The stages do not know which provider sent the note.

## Stickers

The site uses one set: [Animated Fluent Emojis](https://github.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis) (Microsoft Fluent Emoji, MIT). Files live in `public/stickers/` and are mapped only in `src/stickers.js`.

Hero faces and hearts are animated WebP, so they play in an `<img>` without a second animation library. GSAP still handles the float, transitions, and the runaway button. Date-type icons that exist as a single frame in that set are still WebP from the same family. `prefers-reduced-motion` swaps animated stickers for the matching `*-still.webp` frame.

To swap the set:

1. Replace the files in `public/stickers/`. Keep the same names, or update the ids in `src/stickers.js`.
2. Each entry has `src`, `still`, `width`, `height`, and `alt`. Point `still` at a non-animated frame when the main file loops.
3. Do not import a second sticker family. Card icons, hearts, and expressions should stay in this one map.

## Deploy

`dist/` is static. For GitHub Pages project sites, set `base` in `vite.config.ts` to the repository path before building. Netlify and Vercel can use the default base `/`. There is no client-side router, so you do not need a SPA redirect rule.

## Design notes

- The written stages are loading, gate, invalid, then five numbered steps. The progress dots cover those five steps (answer, plan, when, contact, done). They stay hidden on the loader, the gate, and the invalid screen.
- Stage 3 title: “When shall I steal you away?” Stage 4 title: “Where can I reach you?”
- Display type is Cormorant Garamond. Body type is DM Sans. Both load from Google Fonts.
- The phone field defaults to +971 and offers a short international list. A number is accepted when the country code plus the local digits form an E.164-like value of 8 to 15 digits.
- The “No” button is portaled to `document.body` once it runs. The glass card uses `backdrop-filter`, which would otherwise trap a `position: fixed` button inside the card. Each hover or touch moves it to a random spot that stays on screen and clear of “Yes”. Keyboard users can still tab to it; Enter or Space makes it dodge instead of trapping focus. “Yes” grows about 14% each time, capped so it stays in the viewport.
- Date and time use native `date` and `datetime-local` inputs so mobile browsers keep their own pickers.
- The page is marked `noindex`. It is a private invitation, not a public marketing page.
