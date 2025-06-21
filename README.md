# YouApp Frontend Test – Mobile Web App

This project is a frontend coding test for YouApp, built using **Next.js 13 (App Router)**, **Tailwind CSS**, and **React architecture best practices**.

## Features Implemented

- Login (`POST /api/login`)
- Register (`POST /api/register`)
- View Profile (`GET /api/profile`)
- Logout (clears token & redirects to login)
- Horoscope & Chinese Zodiac calculated **locally**
- Tailwind CSS with modular, custom configuration
- Protected routes using token-based auth (localStorage)
- Dynamic routing using `app/` directory from Next.js 13

## Tech Stack

- [Next.js 13 (App Router)](https://nextjs.org/docs/app)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [React Hooks](https://react.dev/)
- [API Base URL](http://techtest.youapp.ai/)
- Local utility for zodiac calculation (`lib/zodiac.ts`)

## Login Credentials for Testing

You can use the default test account:

Email: michael.scott@youapp.ai
Password: 12345678


> Note: The API is not persistent. Registered accounts may not work after reload. This is expected based on the test API behavior.

## Project Structure (Key Files)

/app
├─ /login/page.tsx
├─ /register/page.tsx
├─ /profile/page.tsx
/lib
└─ zodiac.ts // Local horoscope + zodiac logic
/tailwind.config.js // Custom Tailwind setup


## How to Run Locally

```bash
git clone https://github.com/your-username/tes-frontend-youapp.git
cd tes-frontend-youapp
npm install
npm run dev

Open http://localhost:3000 in your browser.

## Extras
Horoscope and Zodiac calculation is based on the provided reference Google Spreadsheet

UI optimized for mobile web


Created by Faizal Erich Purinanda