# Kadi

Kadi lets Ghanaian small businesses create a professional online
business page — website, product catalogue, WhatsApp button, Google
Maps, opening hours, contact form — without hiring a developer.

One codebase serves every business. A "new business" is a database
row, not a new deployment: the business fills in a dashboard form,
picks a template, and gets a live page at `their-name.kadi.app`.

---

## 1. What's in this project

```
kadi/
├── README.md                              ← you are here
├── .env.example                            ← copy to .env and fill in
├── .gitignore
├── package.json
├── middleware.ts                           # subdomain routing + dashboard auth gate
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
│
├── prisma/
│   └── schema.prisma                       # ALL data models (businesses, products,
│                                            # photos, hours, socials, payments, etc.)
│
├── lib/
│   ├── db.ts                               # Prisma client singleton
│   ├── auth.ts                             # password hashing + JWT session cookie
│   ├── slug.ts                             # unique slug generation (kofis-chop-bar)
│   └── storage.ts                          # image upload — local disk now, swap for
│                                            # S3/Cloudinary before you deploy
│
├── components/
│   ├── dashboard/
│   │   └── ImageUploadField.tsx            # reusable upload input for dashboard forms
│   └── templates/
│       ├── index.tsx                       # templateId -> component registry
│       │                                    # (THE file that makes 1 codebase scale)
│       ├── types.ts                        # shared data contract every template uses
│       ├── shared/
│       │   ├── WhatsAppButton.tsx
│       │   └── ContactForm.tsx
│       ├── restaurant/RestaurantTemplate.tsx
│       ├── salon/SalonTemplate.tsx
│       ├── fashion/FashionTemplate.tsx
│       ├── mechanic/MechanicTemplate.tsx
│       ├── school/SchoolTemplate.tsx
│       ├── construction/ConstructionTemplate.tsx
│       ├── retail/RetailTemplate.tsx
│       └── professional-services/ProfessionalServicesTemplate.tsx
│
└── app/
    ├── layout.tsx                          # root layout (required by Next.js)
    ├── globals.css                         # Tailwind imports
    ├── page.tsx                            # home/landing page
    ├── login/page.tsx                      # login + signup form
    │
    ├── b/
    │   └── [slug]/page.tsx                 # THE ONE public route that serves
    │                                        # every business's page
    │
    ├── dashboard/
    │   ├── layout.tsx                      # auth-gated shell (logout button)
    │   ├── page.tsx                        # list businesses / create new one
    │   ├── [businessId]/
    │   │   ├── page.tsx                    # edit business: info, hours, socials,
    │   │   │                                # products, photo gallery, publish
    │   │   ├── actions.ts                  # every server action (all writes go
    │   │   │                                # through here, each re-checks ownership)
    │   │   └── analytics/page.tsx          # view counts + contact messages
    │   └── billing/[businessId]/page.tsx   # Mobile Money plan upgrade page
    │
    └── api/
        ├── auth/
        │   ├── signup/route.ts
        │   ├── login/route.ts
        │   └── logout/route.ts
        ├── upload/route.ts                 # image upload endpoint
        ├── billing/
        │   ├── initialize/route.ts         # starts a MoMo charge via Paystack
        │   └── webhook/route.ts            # Paystack calls this when payment resolves
        └── businesses/
            ├── route.ts                    # create / list businesses (used by dashboard)
            └── [slug]/
                ├── route.ts                # fetch one business's full public data
                ├── contact/route.ts        # public contact form submission
                └── track/route.ts          # analytics click/view tracking
```

Every file above already exists at that exact path in this project —
nothing needs moving.

---

## 2. Prerequisites

- Node.js 18.18+ (check with `node -v`)
- A PostgreSQL database. Easiest free options:
  - [Supabase](https://supabase.com) (free tier, gives you a `DATABASE_URL` directly)
  - [Neon](https://neon.tech) (free tier, serverless Postgres)
  - [Railway](https://railway.app)
  - Note: this project does **not** use the Supabase SDK or any
    Supabase-specific features — if you use Supabase, it's purely as
    a hosted Postgres database via its connection string.
- A [Paystack](https://paystack.com) account (only needed for the
  Mobile Money billing feature — you can skip this at first and the
  rest of the app works fine).
- A GitHub account and Git installed locally.

---

## 3. Local setup, step by step

### 3.1 Install dependencies
```bash
npm install
```

### 3.2 Set environment variables
```bash
cp .env.example .env
```
Then open `.env` and fill in:
- `DATABASE_URL` — your Postgres connection string
- `JWT_SECRET` — any long random string. Generate one with:
  ```bash
  openssl rand -base64 32
  ```
- `PAYSTACK_SECRET_KEY` — from your Paystack dashboard under
  Settings → API Keys & Webhooks (use the **test** secret key while
  developing; it starts with `sk_test_`)

### 3.3 Create the database tables
```bash
npx prisma migrate dev --name init
```
This reads `prisma/schema.prisma` and creates every table in your
database. Re-run `npx prisma migrate dev` any time you change the
schema file.

### 3.4 Run the app
```bash
npm run dev
```
Open `http://localhost:3000`. You should see the Kadi landing page.

### 3.5 Try the full flow
1. Go to `/login`, click "Sign up", create an account.
2. You'll land on `/dashboard` — create a business.
3. Click into it, fill in info, upload a logo, add products, set
   hours, add social links.
4. Click "Publish page".
5. Visit `/b/your-business-slug` to see the live page.
6. (Optional) Visit `/dashboard/billing/[businessId]` to test the
   Mobile Money checkout flow — this will actually call Paystack's
   API, so use their sandbox test numbers, not a real phone, while
   `PAYSTACK_SECRET_KEY` is a test key.

If anything fails at this point, it's almost always one of:
- `DATABASE_URL` wrong or the database unreachable
- forgot to run `npx prisma migrate dev`
- missing `.env` file entirely (Next.js won't read `.env.example`)

---

## 4. Pushing this to GitHub

From inside the `kadi` project folder:

```bash
git init
git add .
git commit -m "Initial commit — Kadi scaffold"
```

Then create a new empty repository on GitHub (no README, no
.gitignore, no license — this project already has those), and:

```bash
git remote add origin https://github.com/YOUR_USERNAME/kadi.git
git branch -M main
git push -u origin main
```

**Important:** `.gitignore` already excludes `.env`, `node_modules`,
and `.next` — never commit your `.env` file or real secrets to
GitHub. Only `.env.example` (with placeholder values) should be
committed.

---

## 5. Deploying

The easiest path is [Vercel](https://vercel.com) (made by the same
team as Next.js):

1. Push this repo to GitHub (see above).
2. On vercel.com, "Add New Project" → import the `kadi` repo.
3. In the project's Environment Variables settings, add the same
   three variables from your `.env` file (`DATABASE_URL`,
   `JWT_SECRET`, `PAYSTACK_SECRET_KEY`).
4. Deploy.

**One thing to fix before or right after deploying:** `lib/storage.ts`
currently saves uploaded images to local disk
(`public/uploads/`). This works in local dev but **will not persist**
on Vercel, since its filesystem is temporary. Before real users upload
photos in production, swap `lib/storage.ts`'s implementation for an
S3 or Cloudinary upload call — the rest of the app only ever calls
`saveUpload(file)` and stores whatever URL comes back, so this is a
one-file change.

Also register your Paystack webhook URL
(`https://your-real-domain.com/api/billing/webhook`) in the Paystack
dashboard once you have a production domain, so successful Mobile
Money payments actually mark businesses as upgraded.

### Subdomains in production
`middleware.ts` routes `business-slug.kadi.app` → that business's
page. For this to work on your real domain:
1. Buy your domain and point it at Vercel.
2. In Vercel's domain settings, add a wildcard domain: `*.yourdomain.com`.
3. Update `ROOT_DOMAINS` in `middleware.ts` to match your real root
   domain instead of the placeholder `kadi.app`.

---

## 6. What's genuinely still missing (be aware before real users)

- **Contact form + click tracking** is only wired into the Restaurant
  template right now. Copy the `ContactForm` import and JSX block
  from `components/templates/restaurant/RestaurantTemplate.tsx` into
  the other 7 templates to enable it everywhere (a few lines each).
- **Custom domains**: the `custom_domains` table exists in the schema
  but nothing writes to it yet — there's no UI or verification flow
  for a business to connect their own domain.
- **Rate limiting**: `/api/businesses/[slug]/contact` and `/track`
  are public and unauthenticated by design (visitors need to reach
  them) — add rate limiting before launch to prevent spam/abuse.
- **Image storage**: see the deployment note above — must be swapped
  off local disk before production use.
- **Paystack**: currently uses test credentials in your `.env` —
  switch to live keys only once you're ready to accept real payments,
  and test the Mobile Money flow thoroughly with Paystack's sandbox
  first.
