# TRAKSI (Transparansi Gizi Nasional)

**TRAKSI** is a food nutrition tracking and transparency platform designed for Indonesia's free nutritious meals program (Makanan Bergizi Gratis - MBG). The system caters to 4 primary user roles:
1. **Vendor** (food producers / kitchens)
2. **Ahli Gizi** (nutritionists)
3. **Sekolah** (schools)
4. **Pemerintah** (government officials)

---

## 🎯 Tech Stack
- **Frontend:** React (Vite), React Router v6, Framer Motion, Lucide React, Recharts
- **Styling:** Tailwind CSS v4.0 (with PostCSS and Custom Utility spacing)
- **Backend:** Express.js (Node.js) on Port 3001
- **Database:** MySQL (Local development via Laragon)

---

## ✅ What Has Been Completed So Far

### 1. UI & Spacing Refactoring
- **Clean Layouts & Aesthetics:** Large paddings (3rem+), massive border-radiuses (30px-50px), and excess margins have been reduced to cleaner, standard spacing (`1rem` to `1.5rem` paddings, `8px` to `16px` border-radiuses, `1rem` gaps) across the landing page, login page, and all dashboards.
- **Tailwind CSS v4 Setup:** Migrated the project to Tailwind CSS v4.0, configuring imports via `@import "tailwindcss";` and `@config "../tailwind.config.js";` in `src/index.css` to enable Tailwind's compiler.
- **Shared Dashboard Layout (`src/components/DashboardLayout.jsx`):** Role-specific layout containing a top navigation bar (with user info, notifications, logout) and a collapsible sidebar. Includes a floating "Ganti Peran" FAB in development to switch user context quickly.
- **Role Theme Spacing:**
  - **Vendor:** Orange (`--theme-vendor`)
  - **Ahli Gizi:** Teal (`--theme-ahligizi`)
  - **Sekolah:** Purple (`--theme-sekolah`)
  - **Pemerintah:** Blue (`--theme-pemerintah`)

### 2. Component & Form Library
- **Core UI Components (`src/components/ui/`):** Created clean, standard reusable components:
  - `Button.jsx`
  - `Card.jsx`
  - `Input.jsx`
  - `Modal.jsx`
  - `Table.jsx`
- **Modular Forms (`src/components/forms/`):** Created `AddDapurForm.jsx` and `AddMenuForm.jsx` to clean up dashboard files.

### 3. Vendor Dashboard Feature Additions
- **Stock Management (Bahan Baku):** Added stock listing and management inside the Vendor dashboard.
- **Production Ticket Workflow (Tiket Produksi):** Introduced a production state machine. Vendors can click "Mulai Proses (Potong Stok)" to reduce ingredient inventory and "Selesai & Serahkan Kurir" to complete tickets and prepare them for delivery.

### 4. Database & API Client
- **MySQL Database Dump (`database/traksi_db.sql`):** Contains 15 tables (users, schools, kitchens, menus, production, etc.) with pre-seeded test data.
- **Express Backend:** Complete CRUD endpoints mapped to the MySQL connection (`root@localhost:3306` with no password).
- **Frontend API Wrapper (`src/api.js`):** Modular client library mapping to Express endpoints.

---

## ❌ What Needs To Be Done Next

### Phase 3: Complete UI Simplification (In Progress)
- **Toggleable Forms:** Ensure that all add/edit forms across the remaining dashboards (Ahli Gizi, Sekolah, Pemerintah) are hidden by default and displayed as slide-in panels or inline toggles only when clicked.
- **Form Component Integration:** Replace old inline forms with the modular forms inside `src/components/forms/` and components inside `src/components/ui/`.

### Phase 4: Connect Frontend to Backend API
- **Replace Mock Data:** Currently, dashboards read state locally from `mockData.js` and `localStorage`. Update pages to use the asynchronous client `src/api.js` to read and write database records.
- **Database Authentication:** Update `Login.jsx` to verify credentials using `api.login()` instead of local hardcoded matching.

### Phase 5: Landing Page Cleanup
- **Decluttering:** Simplify `src/pages/LandingPage.jsx` further to match the cleaner modern design guidelines.

---

## 🔑 Credentials & local setup

### Local Database Config (Laragon)
- **Host:** `localhost`
- **Port:** `3306`
- **User:** `root`
- **Password:** *(empty)*
- **Database Name:** `traksi_db`

### Test Accounts
| Role | Email | Password |
|---|---|---|
| **Vendor** | `v.jaktim@traksi.id` | `vendor123` |
| **Pemerintah** | `gov.dki@traksi.id` | `gov123` |
| **Ahli Gizi** | `nutri.jaktim@traksi.id` | `nutri123` |
| **Sekolah** | `sdn06@sekolah.traksi.id` | `sekolah123` |

### Running the Project Locally
To run both the backend server and frontend development environments simultaneously:

1. **Start the Backend API Server:**
   ```bash
   npm run server
   # Server runs at http://localhost:3001
   ```

2. **Start the Frontend Vite Dev Server:**
   ```bash
   npm run dev
   # App runs at http://localhost:5173
   ```
