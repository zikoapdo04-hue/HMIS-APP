# HMIS APP (Healthcare Management Information System)

## Overview
HMIS APP is a modern, responsive web application designed for comprehensive healthcare management. It caters to three primary roles: Patients, Doctors, and Administrators. The application facilitates appointment bookings, patient record management, doctor schedules, and holistic clinic management.

## Tech Stack
- **Frontend Framework:** React 19
- **Build Tool:** Vite
- **Language:** TypeScript
- **Backend & Database:** Firebase (Authentication & Firestore)
- **Styling:** Custom CSS with a distinct Teal-themed RTL-compliant UI.
- **Routing:** Custom state-based navigation management (No external router like react-router is used).

## Project Architecture & Structure

```
HMIS APP/
├── src/
│   ├── assets/           # Static media and icons
│   ├── components/       # Reusable UI components (e.g., Icons.tsx)
│   ├── context/          # React Context providers (AuthContext.tsx)
│   ├── screens/          # Application views organized by feature/role
│   │   ├── admin/        # Admin dashboard, clinic management, doctor & patient tracking
│   │   ├── auth/         # Login, patient registration, doctor registration
│   │   ├── doctor/       # Doctor dashboard, profiles, records, and settings
│   │   └── patient/      # Patient dashboard, appointment booking, search, notifications
│   ├── App.tsx           # Main application entry and custom routing logic
│   ├── App.css           # Global application styles
│   ├── index.css         # Utility classes and base styles
│   ├── firebase.ts       # Firebase initialization and configuration
│   ├── types.ts          # Global TypeScript interfaces and types
│   └── main.tsx          # React DOM mounting
├── .env                  # Environment variables for Firebase config
├── .env.example          # Template for environment variables
├── firebase.json         # Firebase hosting and configuration rules
├── package.json          # Project dependencies and npm scripts
└── vite.config.ts        # Vite configuration
```

## Features by Role

### 👨‍⚕️ Patients
- **Home Dashboard:** Quick overview of services, upcoming appointments, and notifications.
- **Clinics & Search:** Browse various clinic departments and search for specific doctors.
- **Appointments:** Book new appointments, view booking status (Booking Success), and manage existing appointments.
- **Profile & Settings:** Edit personal details and manage account preferences securely.
- **Support & Notifications:** Access support tickets and view real-time system notifications.

### 🩺 Doctors
- **Doctor Dashboard:** Overview of daily schedule and incoming patient appointments.
- **Patient Records:** View and manage patient medical records securely.
- **Profile Management:** Update specialty, working hours, and professional details.
- **Settings:** Configure notifications and system preferences.

### 🛡️ Admin
- **Admin Dashboard:** Central control panel for holistic clinic management.
- **Clinic Management:** Oversee operations, configure specific clinic views (e.g., Cardiology, Pediatrics) using dynamically passed props.
- **User Management (Doctors & Patients):** Monitor and manage all registered doctors and patients in the system.

## Setup and Installation

1. **Clone the project repository** (if applicable).
2. **Install dependencies:**
   ```bash
   npm install
   ```
   *Note: Using npm is recommended based on the `package-lock.json` file in the project structure.*

3. **Configure Environment Variables:**
   Duplicate `.env.example` and rename it to `.env`. Fill in your Firebase configuration keys mapping to your Firebase Console:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```
4. **Run the Development Server:**
   ```bash
   npm run dev
   ```
5. **Build for Production:**
   ```bash
   npm run build
   ```

## Key Implementations
- **Authentication:** Persistent authentication state managed through `AuthContext` integrating seamlessly with Firebase Auth. This context directly affects the custom router logic to automatically redirect users to their role-specific dashboard upon login.
- **Custom Router Logic:** The `App.tsx` file defines a robust custom stack-based navigation system using `useState` and `window.history` logic. This ensures back button compatibility and seamless smooth transitions (`screen-fade-in` / `screen-fade-out`) between the 26 unique UI screens.
- **Extensible Dataconnect:** The project is configured with an `@dataconnect/generated` module linking to the local `src/dataconnect-generated` directory as defined in the `package.json`.
