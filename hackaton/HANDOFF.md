# TRAKSI Project — Handoff Document
**Date:** 2026-06-05  
**Project:** Admin-MasBahlilGanteng/hackaton  
**Path:** `c:\Users\Administrator\Documents\GitHub\Admin-MasBahlilGanteng\hackaton`

---

## 🎯 Project Overview

**TRAKSI** (Transparansi Gizi Nasional) — A food nutrition tracking and transparency platform for Indonesia's free nutritious meals program (MBG). It has 4 user roles: **Vendor** (food producers), **Ahli Gizi** (nutritionists), **Sekolah** (schools), and **Pemerintah** (government).

**Tech Stack:** React (Vite), React Router v6, Framer Motion, Lucide React, Recharts, Express.js backend, MySQL (via Laragon).

---

## ✅ What Has Been Completed

### Phase 1: Navigation Overhaul (DONE)
1. **CSS Design System** (`src/index.css`) — 4 role-specific color themes via CSS variables:
   - Vendor = Orange, Ahli Gizi = Teal, Sekolah = Purple, Pemerintah = Blue
   - Variables: `--role-primary`, `--role-light`, `--role-accent`
   - Theme classes: `.theme-vendor`, `.theme-ahligizi`, `.theme-sekolah`, `.theme-pemerintah`

2. **DashboardLayout** (`src/components/DashboardLayout.jsx`) — NEW shared layout:
   - Top navigation bar (breadcrumbs, notifications, user info, logout)
   - Collapsible sidebar with toggle
   - Mobile responsive (hamburger overlay on <1024px)
   - "Ganti Peran" floating action button (redirects to login for quick role switching)
   - Auto-applies theme class based on user role

3. **Sidebar** (`src/components/Sidebar.jsx`) — Refactored:
   - Removed old "Simulator Peran" role switcher
   - Added collapse/expand with icon-only mode
   - Active items use `--role-primary` colors

4. **Login** (`src/pages/Login.jsx`) — Redesigned:
   - Left panel color changes per selected role (live preview)
   - "Masuk Cepat" one-click quick login per role
   - Auto-fills credentials when role selected
   - Manual email/password form below

5. **All 4 Dashboards** — Refactored to use `<DashboardLayout>`:
   - `src/pages/VendorDashboard.jsx` — imports DashboardLayout instead of Sidebar
   - `src/pages/AhliGiziDashboard.jsx` — same
   - `src/pages/SekolahDashboard.jsx` — same
   - `src/pages/PemerintahDashboard.jsx` — same
   - Removed: FoodItem3D, FloatingShape, Motif decorative components
   - Removed: Inline Footer components
   - Kept: All CRUD, modals, forms, charts, data tables

### Phase 2: MySQL Database (DONE)
1. **SQL Dump** (`database/traksi_db.sql`) — 15 tables with seed data:
   - `users` (4 accounts), `sekolah` (6 schools), `vendors` (1), `dapur` (1)
   - `mapping_dapur_sekolah`, `menus` (2), `produksi` (1), `distribusi` (1)
   - `standar_gizi` (3), `validasi_log` (1), `konfirmasi_kedatangan` (empty)
   - `feedback` (2), `alerts` (3), `wilayah_data` (17 regions), `dokumen_vendor` (3)
   - **Already imported** into MySQL on localhost:3306

2. **Express Backend** (`server/index.js` + `server/db.js`):
   - Runs on **port 3001**
   - Full CRUD API for all tables
   - MySQL connection: `root@localhost:3306`, no password, database `traksi_db`
   - Start with: `npm run server`

3. **Frontend API Client** (`src/api.js`):
   - Clean async/await wrapper for all endpoints
   - Usage: `import api from '../api'` then `await api.getMenus()`, etc.

---

## ❌ What Still Needs To Be Done

### Phase 3: UI Simplification (NEXT TASK)
The user wants to simplify the data listing pages:
- **Add forms should be hidden by default**, shown only when user clicks "Add" button
- **Edit forms should be hidden too**, shown inline or as panel when editing
- **Cancel hides the form** again
- This applies to all CRUD pages across all 4 dashboards
- The approach: slide-in/toggle panels instead of always-visible forms or modal-heavy patterns

### Phase 4: Connect Frontend to Backend API
- Replace `mockData.js` usage with real API calls using `src/api.js`
- Replace `localStorage` state management with database-backed state
- Wire up Login to use `api.login()` instead of hardcoded credential matching
- Each dashboard should `useEffect` → `api.getXxx()` on mount

### Phase 5: Landing Page
- Simplify `src/pages/LandingPage.jsx` to match the new cleaner aesthetic
- Reduce visual clutter (motifs, floating decorations)

---

## 🗂️ Key File Map

```
hackaton/
├── database/
│   └── traksi_db.sql          # MySQL dump (already imported)
├── server/
│   ├── db.js                  # MySQL connection pool config
│   └── index.js               # Express API server (port 3001)
├── src/
│   ├── api.js                 # Frontend API client
│   ├── index.css              # CSS design system with role themes
│   ├── App.jsx                # Router + ProtectedRoute logic
│   ├── components/
│   │   ├── DashboardLayout.jsx # Shared layout (top nav + sidebar)
│   │   └── Sidebar.jsx         # Collapsible sidebar navigation
│   ├── data/
│   │   └── mockData.js         # Current mock data (to be replaced by API)
│   └── pages/
│       ├── Login.jsx            # Login with quick-login role cards
│       ├── LandingPage.jsx      # Public landing (needs simplification)
│       ├── VendorDashboard.jsx  # ~1330 lines, uses DashboardLayout
│       ├── AhliGiziDashboard.jsx # ~900 lines, uses DashboardLayout
│       ├── SekolahDashboard.jsx  # ~300 lines, uses DashboardLayout
│       └── PemerintahDashboard.jsx # ~570 lines, uses DashboardLayout
└── package.json               # Scripts: "dev" (vite), "server" (express)
```

---

## 🔑 Credentials & Connections

### MySQL
- **Host:** localhost
- **Port:** 3306
- **User:** root
- **Password:** (empty)
- **Database:** traksi_db
- **Tool:** Laragon (C:\laragon)
- **MySQL binary:** C:\laragon\bin\mysql\mysql-8.0.30-winx64\bin\mysql.exe

### App Login Accounts
| Role | Email | Password |
|------|-------|----------|
| Vendor | v.jaktim@traksi.id | vendor123 |
| Pemerintah | gov.dki@traksi.id | gov123 |
| Ahli Gizi | nutri.jaktim@traksi.id | nutri123 |
| Sekolah | sdn06@sekolah.traksi.id | sekolah123 |

### Running the App
```bash
# Terminal 1 — Backend API
npm run server    # → http://localhost:3001

# Terminal 2 — Frontend
npm run dev       # → http://localhost:5173
```

---

## 🧠 Design Decisions & Context

1. **Navigation philosophy:** Combined top-nav + collapsible sidebar. Top nav shows context (breadcrumbs, user), sidebar has role-specific menu items.

2. **Color identity over text:** Each role is identified by its color theme. No need for "You are logged in as Vendor" text — the orange tells you.

3. **"Ganti Peran" FAB:** Floating button in bottom-right of dashboards that navigates back to login page. This is a dev/demo convenience — can be removed for production.

4. **Sidebar menu config:** Defined in `Sidebar.jsx` via `menuMap` object. Each role has its own set of menu items with icons and paths.

5. **Data flow (current):** Dashboards read from `mockData.js` and `localStorage`. The plan is to replace this with `api.js` calls to the Express backend.

6. **UI simplification goal:** User wants data pages to have a clean list/table view by default. Add/edit forms should be toggleable panels (hidden by default, revealed on action, hidden on cancel). No permanent forms cluttering the screen.

---

## 📝 User Preferences
- Desktop-first, but mobile should still work
- Simple, clean UI — not overly decorative
- Practical over flashy
- MySQL via Laragon for local development
- Quick role switching for testing is important
