# Campus Lost & Found Portal (MERN)

React (Vite) + Tailwind, Express, MongoDB (Mongoose), JWT auth. Styled per the Mobbin-inspired monochrome design system (ink on white, pill buttons, no shadows).

## Prerequisites
Node 18+ and a running MongoDB (local `mongod` or an Atlas URI).

## Setup
```bash
cp .env.example .env          # edit MONGO_URI and JWT_SECRET
cd server && npm install && npm run seed && npm run dev
# new terminal
cd client && npm install && npm run dev
```
Open http://localhost:5173 (the Vite dev server proxies `/api` and `/uploads` to port 5000).

Seed logins: `asha@college.edu` / `ben@college.edu`, password `password123`.

## Try the claim flow
1. Log in as Ben, open "Student ID card" (his FOUND listing) and see Asha's pending claim in "My reports".
2. Accept it, then "Mark as returned" on the item page. Status updates everywhere.
3. Log in as Asha, open Ben's "Brown wallet" and submit a claim.

## Notes
- Set `COLLEGE_EMAIL_DOMAIN` in `.env` to restrict registration to one domain.
- Uploaded images are stored in `server/uploads/`.
- Passwords are hashed with bcryptjs. Users can only edit or delete their own reports; only the finder can review claims.
