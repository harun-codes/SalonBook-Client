 SalonBook – Salon Appointment Booking Platform

SalonBook is a modern, responsive salon appointment booking platform that makes it easy for customers to discover beauty services, explore service details, and request appointments online.

The platform provides a dedicated customer dashboard and an admin dashboard. Customers can manage their appointments and make secure online payments, while administrators can manage salon services, appointments, customers, and transactions.

Live Website

Visit SalonBook - https://salon-book-client-pied.vercel.app

Backend API: https://salonbook-server-p7uw.onrender.com

Features

 Customer Features
- Browse all available salon services.
- Search services by name.
- Filter services by category.
- Sort services by price.
- View detailed service information.
- Book salon appointments with preferred dates and time slots.
- View appointment history and booking status.
- Cancel pending appointment requests.
- Pay for confirmed appointments using Stripe Checkout.
- View payment history and transaction status.
- Manage personal profile information.

 Admin Features
- Dedicated admin dashboard with statistics.
- Add, update, and delete salon services.
- Activate or deactivate services.
- Upload and manage service images.
- View and manage all appointment requests.
- Confirm or cancel appointments.
- View registered customers.
- Block and unblock customer accounts.
- Monitor payment transactions.
- Manage administrator profile information.

 Authentication & Security
- Secure authentication using Better Auth.
- Email and password authentication.
- Google OAuth authentication.
- Role-based dashboard access.
- Protected customer and admin routes.
- JWT-based API authentication.
- Server-side authorization.
- Blocked-user access restrictions.

 Payment Integration
- Stripe Checkout integration.
- Secure payment processing.
- Stripe webhook verification.
- Automatic payment status updates after verified payment events.
- Transaction history management.

Additional Features
- Fully responsive design.
- Dynamic service listing.
- ImgBB image hosting.
- Toast notifications for success and error feedback.
- Loading states and form validation.
- Reusable UI components.

 Technology Stack

Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- Lucide React
- Sonner
- Better Auth

Backend

- Node.js
- Express.js
- MongoDB
- REST API
- JWT Authentication

Integrations
- Stripe
- Google OAuth
- ImgBB

Deployment
- Vercel (Frontend)
- Render (Backend)
- MongoDB Atlas (Database)

Installation & Setup

 Prerequisites
- Node.js
- npm
- Git

 1. Clone the Client Repository

git clone https://github.com/harun-codes/SalonBook-Client

2. Navigate to the Project Directory

cd salonbook-client

 3. Install Dependencies

npm install

 4. Configure Environment Variables

Create a .env.local file in the root directory and configure the required variables.

Required Environment Variables:

- NEXT_PUBLIC_API_URL
- BETTER_AUTH_URL
- NEXT_PUBLIC_BETTER_AUTH_URL
- BETTER_AUTH_SECRET
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET
- IMAGEBB_API

 5. Run the Development Server

npm run dev

Open [http://localhost:3000](http://localhost:3000) in your browser.

Related Repositories

- Client Repository:  https://github.com/harun-codes/SalonBook-Client
- Server Repository: https://github.com/harun-codes/SalonBook-Server

 License

This project was developed By Harun Or Roshid
