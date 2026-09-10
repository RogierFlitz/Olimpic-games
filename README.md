# Flitz Beach Olympic Games

Mobile-first PWA companion for the Flitz Beach Olympic Games.

Participants use it on the beach for:

1. Scan & join  
2. Team / country  
3. Up next  
4. Game instructions  
5. Route to station  
6. Live ranking  
7. Opening flame, golden event, final, medals  

Not an admin dashboard for athletes. One primary action per screen.

## Demo

- Participant join: `/games/ABC123`
- Official: `/official`
- Host command center: `/host`
- Admin / game library: `/admin`

Live state syncs across tabs via `BroadcastChannel` + `localStorage` so an official completing a round updates the participant app without refresh.

## Stack

- Next.js App Router
- Tailwind v4
- PWA service worker (`public/sw.js`)
- NL / EN (DE / FR ready)

## Develop

```bash
npm install
npm run dev
```

Open on a phone-width viewport (320–430px).
