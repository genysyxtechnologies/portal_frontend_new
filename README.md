# School Portal Frontend

This is a Vue 3 frontend application for a school portal system with role-based access control for administrators, staff, and students.

## Project Structure

The project is organized with a focus on role-based separation and clean architecture:

```
portal-frontend-new/
├── src/
│   ├── assets/               # Static assets (images, fonts, etc.)
│   ├── components/           # UI components
│   │   ├── admin/            # Admin-specific components
│   │   ├── staff/            # Staff-specific components
│   │   ├── student/          # Student-specific components
│   │   ├── layout/           # Layout components for each role
│   │   ├── shared/           # Components shared across roles
│   │   └── ui/               # Reusable UI components
│   ├── composables/          # Vue composables (usePermissions, etc.)
│   ├── directives/           # Custom Vue directives
│   ├── router/               # Vue Router configuration
│   │   ├── guards/           # Navigation guards for auth and roles
│   │   └── routes/           # Route definitions for each role
│   ├── services/             # API services
│   │   ├── api/              # Core API client and helpers
│   │   ├── admin/            # Admin-specific services
│   │   ├── staff/            # Staff-specific services
│   │   └── student/          # Student-specific services
│   ├── stores/               # Pinia stores
│   │   ├── admin/            # Admin-specific stores
│   │   ├── staff/            # Staff-specific stores
│   │   ├── student/          # Student-specific stores
│   │   └── shared/           # Shared stores (auth, ui)
│   ├── themes/               # PrimeVue theme configuration
│   │   ├── fpn/              # FPN theme customizations
│   │   └── lafia/            # Lafia theme customizations
│   ├── types/                # TypeScript type definitions
│   ├── utils/                # Utility functions
│   │   └── permissions/      # Role-based permissions utilities
│   └── views/                # Page components
│       ├── admin/            # Admin views
│       ├── staff/            # Staff views
│       ├── student/          # Student views
│       └── shared/           # Shared views (auth, errors)
└── .env                      # Environment variables
```

## Key Features

- **Role-Based Access Control**: Separate interfaces for admin, staff, and student users
- **Dynamic Theming**: Theme configuration based on school (FPN, Lafia, etc.)
- **PrimeVue Integration**: Complete UI component library with custom styling
- **Responsive Design**: Mobile-friendly layouts for all user interfaces
- **Type Safety**: Full TypeScript integration throughout the application

## Role-Specific Features

### Admin Portal
- User Management (Users, Roles, Permissions)
- Academic Management (Departments, Programs, Courses)
- System Settings and Configuration
- Analytics Dashboard

### Staff Portal
- Course Management
- Student Grading
- Attendance Tracking
- Academic Records

### Student Portal
- Course Registration
- Result Checking
- Fee Payment
- Assignment Submission

## Development

### Prerequisites
- Node.js 16.x or higher
- npm 8.x or higher

### Setup
1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Configure environment variables:
   ```
   cp .env.example .env
   ```
4. Start the development server:
   ```
   npm run dev
   ```

### Environment Variables

- `VITE_URL`: Backend API URL
- `VITE_SCHOOL`: School identifier for theming (e.g., "fpn", "lafia")

## Building for Production

To build the application for production:

```
npm run build
```

This will generate optimized assets in the `dist` directory that can be deployed to any static hosting service.

## Technology Stack

- **Vue 3**: Frontend framework (Composition API)
- **TypeScript**: Type-safe JavaScript
- **Pinia**: State management
- **Vue Router**: Client-side routing
- **PrimeVue 4**: UI component library
- **Vite**: Build tool and dev server

## Contributing

1. Create a feature branch from `develop`
2. Make your changes
3. Submit a pull request

Please follow the established code style and patterns.

## Test data
1. 2022/AR/ARA/0002
