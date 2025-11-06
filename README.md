# Restaurant Staff Scheduling System

A comprehensive web-based staff scheduling system designed for restaurants and hospitality businesses. Built with modern web technologies including Vue 3, TypeScript, Element Plus, and Tailwind CSS.

## ✨ Features

### 👥 Staff Management
- Add, edit, and remove staff members
- Manage staff positions (servers, bartenders, chefs, food prep, dishwashers)
- Set individual rest days for each employee
- Track staff availability and work history

### 📅 Shift Scheduling
- Create daily shift schedules with role-based requirements
- Automatic staff availability checking (excludes staff on rest days)
- Manual staff selection with real-time requirement validation
- Intelligent auto-scheduling with round-robin rotation
- Work history tracking to ensure fair shift distribution

### 📊 Weekly Schedule View
- Interactive weekly calendar with visual schedule overview
- Color-coded role identification system
- Week navigation with previous/next/current week controls
- Export weekly schedules to PDF format
- Responsive design for mobile and desktop viewing

### 🎯 Smart Features
- **Round-Robin Scheduling**: Automatically assigns shifts based on work history to ensure fair distribution
- **Understaffing Alerts**: Visual indicators when shifts don't meet role requirements
- **Work Statistics**: Track how many shifts each employee has worked in the current week
- **PDF Export**: Generate professional PDF reports of weekly schedules
- **Timezone-Safe Date Handling**: Proper date formatting to avoid timezone conversion issues

## 🛠️ Tech Stack

- **Frontend Framework**: Vue 3 with Composition API
- **Language**: TypeScript
- **UI Framework**: Element Plus
- **Styling**: Tailwind CSS v4
- **Build Tool**: Vite
- **State Management**: Pinia
- **Routing**: Vue Router
- **PDF Generation**: jsPDF + html2canvas
- **HTTP Client**: Axios

## 📋 Prerequisites

- Node.js (v20.19.0 or higher, or v22.12.0+)
- npm or yarn package manager

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone <repository-url>
cd scheduling_system
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 4. Backend Setup
This frontend application requires a FastAPI backend server running on `http://127.0.0.1:8000`. Make sure your backend server is running before using the application.

## 📁 Project Structure

```
src/
├── api/                    # API service layers
│   └── staff.ts           # Staff and shift API calls
├── components/            # Reusable Vue components
│   ├── Navbar.vue         # Navigation menu
│   ├── StaffTable.vue     # Staff management table
│   ├── ShiftScheduler.vue # Shift scheduling interface
│   ├── WeeklyScheduleCalendar.vue # Weekly calendar view
│   ├── ShiftDetailDialog.vue # Shift details modal
│   └── WorkHistoryDisplay.vue # Work statistics display
├── composables/           # Vue 3 composables (business logic)
│   ├── useShiftScheduling.ts # Shift scheduling logic
│   ├── useShiftDialog.ts     # Shift dialog management
│   ├── useWeekNavigation.ts  # Week navigation logic
│   ├── useWeeklyShifts.ts    # Weekly shifts data management
│   └── usePDFExport.ts       # PDF export functionality
├── views/                 # Page-level components
│   ├── StaffView.vue      # Staff management page
│   ├── ShiftSchedulerView.vue # Scheduling management page
│   └── WeeklyScheduleView.vue # Weekly calendar page
├── utils/                 # Utility functions
│   └── scheduling.ts      # Date formatting and role utilities
├── types/                 # TypeScript type definitions
│   └── scheduling.ts      # Interface definitions
├── router/                # Vue Router configuration
│   └── index.ts
└── stores/               # Pinia stores
    └── counter.ts
```

## 🎨 Available Scripts

```bash
# Development
npm run dev          # Start development server with hot reload

# Production
npm run build        # Build for production
npm run preview      # Preview production build locally

# Code Quality
npm run lint         # Run ESLint with auto-fix
npm run format       # Format code with Prettier
npm run type-check   # Run TypeScript type checking
```

## 🏗️ Architecture Highlights

### Composables Pattern
The application uses Vue 3's Composition API with a modular composables architecture:
- **Separation of Concerns**: Business logic separated from UI components
- **Reusability**: Composables can be shared across components
- **Testability**: Easy to unit test business logic independently

### Type Safety
Full TypeScript integration ensures:
- Compile-time error detection
- Better IDE support with autocomplete
- Self-documenting code with type definitions

### Responsive Design
Built with mobile-first approach:
- Tailwind CSS utilities for responsive layouts
- Element Plus components with built-in responsiveness
- Touch-friendly interfaces for mobile devices

## 🎯 Usage Guide

### Managing Staff
1. Navigate to "值班人员管理" (Staff Management)
2. Add new staff members with their positions and rest days
3. Edit or remove existing staff as needed

### Creating Schedules
1. Go to "班次调度管理" (Shift Scheduling)
2. Select a date for scheduling
3. Load available staff (excludes those on rest days)
4. Choose between manual selection or automatic round-robin scheduling
5. Generate the shift schedule

### Viewing Weekly Schedules
1. Access "周程安排表" (Weekly Schedule)
2. Navigate between weeks using arrow buttons
3. View color-coded assignments by role
4. Export to PDF for printing or sharing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is private and proprietary.

## 🛟 Support

For support, please contact the development team or create an issue in the repository.
