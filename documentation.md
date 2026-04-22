# ShareIt - Technical Documentation

## Overview
**ShareIt** is a customized Wasp application described as the "Uber for the internet" (Uber az internethez). The platform allows users to purchase data (credits) and consume them through a simplified connectivity interface.

## Core Features & Customizations

### 1. Connectivity Credits System
The heart of the application is a credit-based system where credits represent data volume (GB).
- **Data Model**: The `User` entity in `schema.prisma` includes a `credits` field (Float, default `0.0`).
- **Credit Consumption**: A custom server-side action `deductUserCredits` manages the decrementing of user credits after validating sufficient balance.
- **Unit Conversion**: The frontend handles conversions between Megabytes (Mb) for the user interface and Gigabytes (GB) for database storage (1000Mb = 1GB).

### 2. User Interface
- **Landing Page**: The default root route (`/`) is directed to the **Pricing Page**, encouraging user conversion immediately.
- **Home Page (`/home`)**: 
  - Features the "Netezz!" (Surf/Connect) interface.
  - Displays remaining data in GB: `{user.credits}GB-od maradt!`.
  - Includes an interactive slider for users to select how much data (in Mb) they wish to "spend" or "use".
  - A "Csatlakozás!" (Connect!) button triggers the credit deduction.

### 3. Monetization & Payment Plans
The application uses a credit-based monetization model instead of traditional subscriptions.
- **Plans**: Defined in `src/payment/plans.ts`:
  - **Small**: 1GB (1000 Ft)
  - **Medium**: 5GB (5000 Ft)
  - **Large**: 10GB (10,000 Ft)
- **Payment Processor**: Integrated with Stripe/LemonSqueezy, utilizing custom environment variables for price IDs (`PAYMENTS_SMALL_PRICE_ID`, etc.).
- **Pricing UI**: Custom cards in `PricingPage.tsx` localized with Hungarian Forint (Ft) and specific feature highlights ("Bárhol felhasználható").

### 4. Database Schema Extensions
In addition to standard auth and user fields, the following was added:
- **`User`**:
  - `credits`: Tracks available data volume.
  - `isAdmin`: Boolean flag for administrative privileges.
- **`ContactFormMessage`**:
  - An entity designed to store user feedback/messages, linked to specific users with fields for content, read status, and reply timestamps.

### 5. Authentication & Communication
- **Email Service**: Configured to use **SendGrid**.
- **Sender**: Emails are dispatched from `login@magor-lab.hu`.
- **Custom Flows**: Includes localized/customized content for email verification and password reset via `src/auth/email-and-pass/emails.ts`.
- **User Fields**: 
  - **Admin Logic**: The `isAdmin` status is automatically assigned during signup if the user's email is present in the `ADMIN_EMAILS` environment variable.
  - **Username**: For email-based signups, the `username` field is automatically set to the user's email address.

### 6. UI/UX & Navigation
- **Navigation Bar**:
  - Implements a dynamic, sticky header that changes style when scrolled (transitions from full-width to a floating, rounded "pill" design).
  - Integrates a **Dark Mode Switcher** and a custom **User Dropdown**.
  - Brand identity is enforced through a custom logo (`logo2.svg`) and the "ShareIt" title.
- **Responsive Design**: Includes a dedicated mobile drawer (Sheet component) for navigation on smaller screens.
- **Styling**: Built with **Tailwind CSS**, featuring high-quality transitions, blurs, and localized formatting for Hungarian currency.

### 7. Branding & Configuration
- **Meta Tags**: Customized in `main.wasp` with project-specific descriptions, keywords, and OpenGraph images.
- **Title**: "Uber az internethez".
- **Default Redirects**:
  - On Auth Success: `/home`
  - On Auth Failure: `/login`

## Technical Stack (Customized)
- **Frontend**: React with Tailwind CSS and custom UI components (from Shadcn UI).
- **Backend**: Wasp (Node.js/Express) with Prisma ORM.
- **Database**: PostgreSQL.
- **Payments**: Stripe.
