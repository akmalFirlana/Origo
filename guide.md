### 💡 Universal App Prompt: Origo

I want to build a **web + PWA productivity app** that helps **everyone** manage tasks, habits, calendar events, and personal productivity in one place. It should feel **minimalist, playful, and professional**, with **light & dark modes**. The light theme uses a clean white base, and each component can use **colorful accents** so the UI feels lively.

---

### Project Name:
Origo

---

### Target Audience:
• General users
• Students & individual professionals
• Anyone looking to optimize their time & tasks

---

### Core Features and Pages:

#### ✅ Homepage / Dashboard
• Today's summary: priority tasks (Eisenhower), today's habits, upcoming calendar events.
• Quick actions: add task, add habit, add event.
• Progress rings/mini-charts for weekly habits & productivity.

#### ✅ Todo List (Drag & Drop + Eisenhower Priority)
• Board/list view with **drag & drop** between priority categories:
  - **🔥 Urgent & Important**
  - **⚡ Important, Not Urgent**
  - **⏳ Urgent, Not Important**
  - **🍃 Optional/Low Priority**
• Due date, tags, subtasks, checklist, attachments (optional for v1.1).
• Sorting, filtering (by due date, tag, priority), search.
• PWA notifications for tasks **(due/overdue)**.
• Automatic activity log (create, update, complete).

#### ✅ Habit Tracker (Daily/Weekly/Monthly + Charts)
• Create habits with a specific frequency (daily/weekly), and targets (e.g., 5x/week).
• **Daily checklist**, weekly/monthly view.
• Simple charts (streak, completion rate).
• Activity log (check-in, skip, edit).

#### ✅ Calendar + Planner (Local First in Origo)
• Monthly/weekly/daily calendar views.
• Create events/planner blocks (title, description, location optional).
• **Time suggestions** & basic **time blocking** (drag to set duration).
• PWA notifications for **calendar events** (before event starts).
• No external integration in v1 (Google Calendar can follow later).

#### ✅ Notes & Daily Reflection (v1.1)
• Lightweight notes & a daily reflection template (What went well / Improve tomorrow).
• Link notes to tasks/habits/events (optional for v1.1).

#### ✅ Pomodoro (v1.1)
• 25/5 timer, custom presets, session count.
• (Local notifications for start/finish — v1.1).

#### ✅ Activity Log (Global History)
• A global timeline across all features (tasks, habits, events).
• Filter by feature & date range.
• Export to CSV (optional for v1.1).

---

### Tech Stack (Recommended Defaults):
• **Frontend:** Vite, TypeScript, React, shadcn/ui components, Tailwind CSS
• **Backend & Storage:** Supabase (Postgres + Row Level Security)
• **Auth:** Supabase
• **PWA:** Installable, service worker for basic caching (no functional offline mode in v1), Web Push for task & event reminders
• **State Management:** TanStack Query + Zustand (for UI/local state)
• **Charts:** Simple Recharts for habits & the dashboard

---

### Design Preferences:
• **Font:** Inter
• **Colors:**
  - **Light mode:** clean white background; use Tailwind accents (sky/blue/emerald/amber/fuchsia) per component.
  - **Dark mode:** dark gray background; high contrast; accents remain colorful.
  - **Primary (suggestion):** `#3B82F6` (Blue 500)
  - **Accent (suggestion):** `#F59E0B` (Amber 500)
• **Layout:** Mobile-first, card-based, modern UI with ample whitespace; smooth micro-interactions.
• **UI Reference:** TickTick (for its clean structure & task focus).

---

### Functional Requirements (MVP Scope):
• Single-user only (no collaboration/real-time features).
• No functional **offline mode** in v1.
• Active reminders: **tasks** (due/overdue) & **calendar events**.
• Sorting/Filtering/Search for tasks & habits.
• Drag & drop for the Todo board & for time blocking in the daily calendar view.
• Automatic activity log for all important changes.

---

### Data Model (High-Level):
• `users`: profile & preferences (theme, notifications).
• `tasks`: title, description, priority (eisenhower), due_date, tags[], status, created_at, updated_at, user_id.
• `habits`: name, schedule (daysOfWeek / perWeekTarget), notes, user_id.
• `habit_logs`: habit_id, date, status (done/skip), note.
• `events`: title, description, start_at, end_at, reminders[], user_id.
• `activity_logs`: entity_type, entity_id, action, metadata(json), created_at, user_id.
• (Optional) `labels/tags`: for tasks & notes.

---

### Key Interactions (UX Flows):
• **Add Task** (quick add) → select Eisenhower priority → set due date → save → appears on dashboard & board.
• **Complete Habit** → tap the checkbox → streak & chart update instantly.
• **Create Event** → drag on the calendar (day/week view) → fill in details → set reminder → notification is scheduled.
• **View Activity** → a timeline with filters (tasks/habits/events, date range).

---

### Security & Privacy:
• Supabase RLS: each user can only access their own data.
• JWT Auth (Email & Google).
• Rate limiting for push notification scheduling.
• Export/delete account (v1.1 for compliance).

---

### Scalability Notes:
• Use indexed queries (by user_id, due_date, priority).
• A simple queue for sending notifications (Supabase functions / cron job).
• Modular components to easily add new features (Pomodoro, Notes) in v1.1.