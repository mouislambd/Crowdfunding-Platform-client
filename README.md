# FundRise - Crowdfunding Platform

- **Live Client URL:** https://crowdfunding-platform-client-flame.vercel.app
- **Server API URL:** https://crowdfunding-platform-server-wj8g.onrender.com

## Demo Admin Credentials
- **Admin Email:** admin@gmail.com
- **Admin Password:** adminadmin

## Key Features
1. **Role-Based Access Control:** Distinct roles for Supporters, Builders, and Admins with secure route guards and automatic redirection.
2. **Credit System:** Supporters can purchase credit packages and use credits to support campaigns.
3. **Campaign Creation & Management:** Builders can create, edit, and delete campaigns with image uploads.
4. **imgBB Image Hosting:** Seamless image uploading for user profile pictures and campaign banners via imgBB API with preview and error handling.
5. **Contributions Workflow:** Supporters contribute to campaigns; builders review pending contributions (Approve/Reject) with modal details.
6. **Withdrawal Requests:** Builders can request withdrawals when meeting minimum credit thresholds, with automatic credit-to-dollar conversion (20 credits = $1).
7. **Admin Dashboard & Management:** Admins can view platform stats, manage users (change roles and remove users), review and manage all campaigns, approve withdrawal requests, and handle reports.
8. **Campaign Reporting & Suspension:** Supporters can report campaigns; admins can review reports, suspend campaigns, or delete them.
9. **Real-time Notifications:** Dashboard top bar notification bell with count badge and floating popup list sorted by newest first.
10. **Responsive Design:** Fully responsive dark-themed UI featuring scrollable data tables (`overflow-x-auto`) across all screens.
11. **Payment & Transaction History:** Comprehensive transaction logs for both supporters and builders.
12. **Interactive Navbar & Sidebar:** Dynamic navigation with session persistence, dropdown menus, and sidebar links.

## Tech Stack
- **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS, Lucide React
- **Authentication:** Better Auth client integration
- **Image Hosting:** imgBB API

## Running Locally

1. Clone the repository and navigate to the client folder:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file with the following environment variables (without values):
   ```env
   NEXT_PUBLIC_API_URL=
   NEXT_PUBLIC_IMGBB_KEY=
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
