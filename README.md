# EduTrack – Student Attendance Management System

A full-featured React + Vite + TypeScript attendance management system with separate **Student** and **Lecturer** portals.

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v18+ ([Download](https://nodejs.org))
- **npm** v9+

### Installation & Run

```bash
# 1. Extract the zip and enter the project folder
cd student-attendance-monitor

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will open automatically at:

```
http://localhost:5173
```

---

## 🔐 Demo Login Credentials

### Student Login
| Field    | Value                        |
|----------|------------------------------|
| Email    | `amara.osei@student.edu`     |
| Password | `student123`                 |

Other student accounts:
- `kelvin.mwangi@student.edu` / `student123`
- `fatima.hassan@student.edu` / `student123`
- `grace.wanjiku@student.edu` / `student123`

### Lecturer Login
| Field    | Value                        |
|----------|------------------------------|
| Email    | `j.kariuki@faculty.edu`      |
| Password | `lecturer123`                |

Other lecturer accounts:
- `m.njoki@faculty.edu` / `lecturer123`
- `p.kamau@faculty.edu` / `lecturer123`

---

## ✨ Features

### Student Portal (Deep Navy + Teal theme)
- 📊 **Dashboard** – Attendance rate, course summary, today's schedule, per-course breakdown
- 📅 **Lecture Schedule** – Weekly schedule with day filter, online/physical badges, join links
- ✅ **Attendance** – Enter attendance codes, view live sessions, full attendance history
- 🎥 **Online Classes** – All virtual classes with direct join links
- 🔐 **Login History** – Session details, device info, recent login log
- 👤 **Profile** – Academic profile overview

### Lecturer Portal (Forest Green + Gold theme)
- 📊 **Dashboard** – Key stats, today's lectures, recent sessions, course overview
- ▶️ **Manage Sessions** – Start/stop sessions, generate attendance codes, real-time check-ins, manual status updates
- 📋 **Attendance Records** – Full filterable record history with export-ready table
- 👥 **Student Overview** – Per-student attendance rates, standings, individual drill-down
- 📅 **Teaching Schedule** – Full weekly timetable
- 👤 **Profile** – Faculty information and session details

---

## 🏗 Project Structure

```
src/
├── components/
│   ├── Sidebar.tsx          # Role-aware navigation sidebar
│   └── ProtectedRoute.tsx   # Auth guard
├── context/
│   ├── AuthContext.tsx       # Login / logout / session state
│   └── AttendanceContext.tsx # Sessions & records state
├── data/
│   └── mockData.ts           # Demo users, lectures, sessions
├── pages/
│   ├── LoginPage.tsx
│   ├── student/
│   │   ├── StudentPortal.tsx
│   │   ├── StudentDashboard.tsx
│   │   ├── StudentSchedule.tsx
│   │   ├── StudentAttendance.tsx
│   │   └── StudentExtra.tsx
│   └── lecturer/
│       ├── LecturerPortal.tsx
│       ├── LecturerDashboard.tsx
│       ├── LecturerSessions.tsx
│       ├── LecturerRecords.tsx
│       ├── LecturerStudents.tsx
│       └── LecturerExtra.tsx
├── styles/
│   └── main.css              # Bootstrap 5 + custom design system
├── types/
│   └── index.ts              # TypeScript interfaces
├── App.tsx
└── main.tsx
```

---

## 🛠 Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| React | 18 | UI framework |
| Vite | 5 | Build tool / dev server |
| TypeScript | 5 | Type safety |
| Bootstrap | 5.3 | Base CSS grid & utilities |
| Bootstrap Icons | 1.11 | Icon set |
| React Router DOM | 6 | Client-side routing |
| date-fns | 3 | Date utilities |

---

## 📝 Notes
- All data is **in-memory** (mock data). Refreshing resets state to defaults (login session persists via localStorage).
- To connect a real backend, replace `mockData.ts` and context fetch logic with API calls.
