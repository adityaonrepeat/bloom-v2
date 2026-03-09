# Bloom v2 — Auth Setup Guide

Complete step-by-step guide to get authentication working with **BetterAuth + Resend + React Email + OAuth (Google & GitHub)**.

---

## Prerequisites

- Node.js 18+
- A PostgreSQL database (local or hosted — Neon, Supabase, Railway, etc.)
- A [Resend](https://resend.com) account (free tier works)
- A Google Cloud project (for Google OAuth)
- A GitHub OAuth App (for GitHub OAuth)

---

## Step 1 — Install Dependencies (already done)

```bash
npm install better-auth @better-auth/prisma-adapter @react-email/components react-email resend zod
```

These are already in your `package.json`.

---

## Step 2 — Set Up Your `.env` File

Create a `.env` file in the project root (if it doesn't exist) with these variables:

```env
# ── Database ──
DATABASE_URL="postgresql://user:password@localhost:5432/bloom?schema=public"

# ── BetterAuth ──
BETTER_AUTH_SECRET="generate-a-random-32-char-string-here"

# ── Resend (Email) ──
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxxxxxxx"
EMAIL_FROM="Bloom <onboarding@resend.dev>"

# ── Google OAuth ──
GOOGLE_CLIENT_ID="xxxxxxxxxxxx.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPx-xxxxxxxxxxxxxxxxxx"

# ── GitHub OAuth ──
GITHUB_CLIENT_ID="Ov23liXXXXXXXXXXXXXX"
GITHUB_CLIENT_SECRET="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# ── App URL ──
BETTER_AUTH_URL="http://localhost:3000"
```

### How to get each value:

### 2a. `BETTER_AUTH_SECRET`

Run this in your terminal:

```bash
npx better-auth secret
```

Or generate a random string:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and paste it as `BETTER_AUTH_SECRET`.

### 2b. `RESEND_API_KEY`

1. Go to [https://resend.com](https://resend.com) and sign up / log in.
2. Go to **API Keys** → **Create API Key**.
3. Name it "Bloom Dev" and copy the key (starts with `re_`).
4. Paste it as `RESEND_API_KEY`.

> **Note:** On Resend's free tier, you can only send emails **to your own email** (the one you signed up with) and **from** `onboarding@resend.dev`. Set `EMAIL_FROM="Bloom <onboarding@resend.dev>"` for now. Once you add and verify a domain, you can change it.

### 2c. Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project (or select an existing one).
3. Go to **APIs & Services** → **Credentials**.
4. Click **Create Credentials** → **OAuth client ID**.
5. Application type: **Web application**.
6. Add **Authorized redirect URIs**:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
7. Copy the **Client ID** and **Client Secret**.

> **Important:** You also need to configure the **OAuth consent screen**:
> - Go to **APIs & Services** → **OAuth consent screen**.
> - Choose **External** (unless you have a Google Workspace org).
> - Fill in the required fields (app name: "Bloom", email, etc.).
> - Add scopes: `email`, `profile`, `openid`.
> - Add your email as a test user.

### 2d. GitHub OAuth Credentials

1. Go to [GitHub Developer Settings](https://github.com/settings/developers).
2. Click **OAuth Apps** → **New OAuth App**.
3. Fill in:
   - **Application name:** `Bloom`
   - **Homepage URL:** `http://localhost:3000`
   - **Authorization callback URL:**
     ```
     http://localhost:3000/api/auth/callback/github
     ```
4. Click **Register application**.
5. Copy the **Client ID**.
6. Click **Generate a new client secret** and copy it.

---

## Step 3 — Set Up the Database

Make sure your PostgreSQL database is running and `DATABASE_URL` in `.env` points to it.

### Push the Prisma schema to the database:

```bash
npx prisma db push
```

### Generate the Prisma client:

```bash
npx prisma generate
```

> If you make any schema changes later, run both commands again.

---

## Step 4 — Verify File Structure

After setup, your auth-related files should look like this:

```
lib/
  auth.ts              ← BetterAuth server config
  auth-client.ts       ← BetterAuth React client
  prisma.ts            ← Shared Prisma instance
  resend.ts            ← Resend client
  validations/
    auth.ts            ← Zod schemas
  actions/
    signin.ts          ← Server action for sign-in
    signup.ts          ← Server action for sign-up

emails/
  verify-email.tsx     ← React Email template for verification
  reset-password.tsx   ← React Email template for password reset

app/
  api/
    auth/
      [...all]/
        route.ts       ← BetterAuth API handler

  auth/
    layout.tsx         ← Split layout (Bloom branding left, form right)
    sign-in/
      page.tsx         ← Sign in form
    sign-up/
      page.tsx         ← Sign up form
    forgot-password/
      page.tsx         ← Request password reset
    reset-password/
      page.tsx         ← Set new password (with token from email)
    verify-email/
      page.tsx         ← Email verification landing page

prisma/
  schema.prisma        ← Database schema with User, Session, Account, Verification
```

---

## Step 5 — Run the App

```bash
npm run dev
```

Then open:

| Page               | URL                                         |
| ------------------ | ------------------------------------------- |
| Sign In            | http://localhost:3000/auth/sign-in           |
| Sign Up            | http://localhost:3000/auth/sign-up           |
| Forgot Password    | http://localhost:3000/auth/forgot-password   |

---

## Step 6 — Test the Full Flow

### 6a. Sign Up

1. Go to `http://localhost:3000/auth/sign-up`.
2. Fill in name, email, password, confirm password.
3. Click **Sign Up**.
4. You should see a "Check your email" screen.
5. Check your inbox for the verification email from Bloom.
6. Click **Verify Email Address** in the email.
7. You'll land on the verify-email page → Click **Sign In**.

### 6b. Sign In

1. Go to `http://localhost:3000/auth/sign-in`.
2. Enter your verified email + password.
3. Click **Sign In** → You should be redirected to `/dashboard`.

### 6c. Forgot Password

1. Go to `http://localhost:3000/auth/forgot-password`.
2. Enter your email → Click **Send Reset Link**.
3. Check your email → Click **Reset Password** in the email.
4. You'll land on `/auth/reset-password?token=...`.
5. Enter a new password → Click **Reset Password**.
6. Sign in with the new password.

### 6d. Google OAuth

1. Click the **Google** button on the sign-in or sign-up page.
2. Select your Google account.
3. You'll be redirected to `/dashboard`.

### 6e. GitHub OAuth

1. Click the **GitHub** button.
2. Authorize the app.
3. You'll be redirected to `/dashboard`.

---

## Troubleshooting

### "Invalid credentials" on sign-in
- Make sure you verified your email first (check your inbox).
- BetterAuth requires email verification when `requireEmailVerification: true`.

### Emails not arriving
- Check your Resend dashboard for logs.
- On the free tier, you can only send to the email you signed up with.
- Make sure `RESEND_API_KEY` and `EMAIL_FROM` are set correctly in `.env`.

### OAuth redirect errors
- Double-check callback URLs match exactly:
  - Google: `http://localhost:3000/api/auth/callback/google`
  - GitHub: `http://localhost:3000/api/auth/callback/github`
- Make sure client ID and secret are correct.

### Prisma errors
- Run `npx prisma db push` to sync the schema.
- Run `npx prisma generate` to regenerate the client.
- Make sure `DATABASE_URL` is correct and the database is running.

### "Module not found" errors
- Run `npm install` to make sure all dependencies are installed.
- Run `npx prisma generate` if Prisma client errors appear.

---

## Production Checklist

When deploying to production:

1. **Change `BETTER_AUTH_URL`** to your production URL (e.g., `https://bloom.yoursite.com`).
2. **Update OAuth callback URLs** in Google Cloud Console and GitHub Developer Settings to use the production URL.
3. **Add a custom domain to Resend** and update `EMAIL_FROM` (e.g., `Bloom <noreply@bloom.yoursite.com>`).
4. **Use a strong `BETTER_AUTH_SECRET`** (at least 32 characters).
5. **Set `NODE_ENV=production`**.

---

## Summary of Environment Variables Needed

| Variable               | Where to get it                                  |
| ---------------------- | ------------------------------------------------ |
| `DATABASE_URL`         | Your PostgreSQL host (Neon, Supabase, local)     |
| `BETTER_AUTH_SECRET`   | `npx better-auth secret` or random hex string    |
| `BETTER_AUTH_URL`      | `http://localhost:3000` (dev)                    |
| `RESEND_API_KEY`       | Resend Dashboard → API Keys                      |
| `EMAIL_FROM`           | `Bloom <onboarding@resend.dev>` (dev)            |
| `GOOGLE_CLIENT_ID`     | Google Cloud Console → Credentials               |
| `GOOGLE_CLIENT_SECRET` | Google Cloud Console → Credentials               |
| `GITHUB_CLIENT_ID`     | GitHub Settings → Developer → OAuth Apps         |
| `GITHUB_CLIENT_SECRET` | GitHub Settings → Developer → OAuth Apps         |
