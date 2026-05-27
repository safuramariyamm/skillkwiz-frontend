# SkillKwiz Dashboard — Integration Guide

## What's in this folder

```
skillkwiz-dashboard/
├── middleware.ts                          ← JWT route guard (goes in project root)
├── tailwind.config.ts                     ← Brand colours, shadows, animations
├── package.json                           ← All dependencies
├── types/dashboard.ts                     ← All TypeScript types
├── services/api.ts                        ← Full API service layer
├── hooks/index.ts                         ← All custom React hooks
├── context/AuthContext.tsx                ← JWT auth context + login/logout
├── components/
│   └── dashboard/
│       ├── layout/
│       │   ├── DashboardLayout.tsx        ← Root layout (sidebar + topbar)
│       │   ├── Sidebar.tsx                ← Collapsible nav sidebar
│       │   └── TopBar.tsx                 ← Breadcrumb + notifications + profile
│       ├── shared/index.tsx               ← StatCard, DataTable, Badge, Btn, etc.
│       └── charts/index.tsx               ← All Recharts components
└── app/dashboard/
    ├── page.tsx                           ← /dashboard root redirect
    ├── admin/
    │   ├── layout.tsx
    │   ├── overview/page.tsx
    │   ├── employers/page.tsx
    │   ├── candidates/page.tsx
    │   ├── revenue/page.tsx
    │   ├── blog/page.tsx
    │   └── health/page.tsx
    ├── employer/
    │   ├── layout.tsx
    │   ├── overview/page.tsx
    │   ├── assessments/page.tsx
    │   ├── slots/page.tsx
    │   ├── candidates/page.tsx
    │   ├── credentials/page.tsx
    │   ├── billing/page.tsx               ← PayPal integration
    │   └── analytics/page.tsx
    └── employee/
        ├── layout.tsx
        ├── booking/page.tsx
        ├── status/page.tsx
        ├── instructions/page.tsx
        └── company/page.tsx
```

---

## Step-by-Step Integration

### Step 1 — Install dependencies
```bash
npm install recharts lucide-react framer-motion clsx
```

### Step 2 — Copy files into your existing Next.js project

Copy each folder/file into your existing app:

| Source                           | Destination (in your project)           |
|----------------------------------|-----------------------------------------|
| `middleware.ts`                  | Project root (same level as `app/`)     |
| `tailwind.config.ts`             | Merge with your existing config         |
| `types/`                         | `types/`                                |
| `services/`                      | `services/`                             |
| `hooks/`                         | `hooks/`                                |
| `context/`                       | `context/`                              |
| `components/dashboard/`          | `components/dashboard/`                 |
| `app/dashboard/`                 | `app/dashboard/`                        |

### Step 3 — Set environment variable
In your `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Step 4 — Wrap your root layout with AuthProvider
In `app/layout.tsx`:
```tsx
import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
```

### Step 5 — Login flow
After a successful login in your existing auth page, store the JWT:
```ts
// The AuthContext.login() handles this automatically
const { login } = useAuth();
const result = await login(email, password);
if (result.ok) router.push("/dashboard");
```

The middleware reads `sk_token` from cookies and redirects users to their
role-specific dashboard (`/dashboard/admin`, `/dashboard/employer`, or `/dashboard/employee`).

### Step 6 — PayPal Integration (Employer Billing)

The billing page calls:
1. `POST /api/payments/create-order` → returns `{ orderId, approvalUrl }`
2. In production: redirect to `approvalUrl` (PayPal hosted page)
3. PayPal redirects back to your return URL
4. `POST /api/payments/capture-order` → finalises payment

For the demo, step 2 is simulated. Replace with:
```ts
window.location.href = orderRes.data.approvalUrl;
```

---

## Role → Dashboard Routing

| JWT `role` field   | Dashboard root                    |
|--------------------|-----------------------------------|
| `admin`            | `/dashboard/admin/overview`       |
| `employer`         | `/dashboard/employer/overview`    |
| `companyEmployee`  | `/dashboard/employee/booking`     |

---

## API Endpoints Used

| Hook / Service           | Endpoint                              |
|--------------------------|---------------------------------------|
| `useCredits`             | `GET /api/payments/balance`           |
| `useAssessments`         | `GET /api/assessments`                |
| `useSlots`               | `GET /api/slots`                      |
| `useEmployerCandidates`  | `GET /api/employers/candidates`       |
| `useCredentials`         | `GET /api/employers/credentials`      |
| `useAdminRevenue`        | `GET /api/admin/revenue/summary`      |
| `useAdminEmployers`      | `GET /api/admin/employers`            |
| `useAdminCandidates`     | `GET /api/admin/candidates`           |
| `useBlogPosts`           | `GET /api/blogs`                      |
| `useBookings`            | `GET /api/assessments/my`             |
| `paymentsAPI.createOrder`| `POST /api/payments/create-order`     |
| `paymentsAPI.captureOrder`| `POST /api/payments/capture-order`   |

All hooks fall back to seed data when the API is unavailable, so the UI works
during development even without a running backend.

---

## Design Tokens

| Token        | Value      | Usage                       |
|--------------|------------|-----------------------------|
| Primary Blue | `#00418d`  | Buttons, links, active nav  |
| Pastel BG    | `#f0f7ff`  | Page background             |
| Sky Blue     | `#daeeff`  | Accents, highlights         |
| Dark Navy    | `#0a1628`  | Sidebar                     |
| Red          | `#f73e5d`  | Danger, CTA accent          |
| Yellow       | `#f6c648`  | Warning badges              |
