### 💡 Universal App Prompt: Origo

I want to build a **web + PWA productivity app** that helps **everyone** manage tasks, habits, calendar events, and personal productivity in one place. It should feel **minimalist, playful, and professional**, with **light & dark modes**. The light theme uses a clean white base, and each component can use **colorful accents** so the UI feels lively.

---

### Project Name:
Origo

---

### Target Audience:
• Pengguna umum  
• Pelajar & profesional individu  
• Siapa pun yang ingin mengoptimalkan waktu & tugas

---

### Core Features and Pages:

#### ✅ Homepage / Dashboard
• Ringkasan hari ini: tugas prioritas (Eisenhower), kebiasaan hari ini, event kalender terdekat.  
• Quick actions: tambah tugas, tambah habit, tambah event.  
• Progress ring/mini charts untuk kebiasaan & produktivitas mingguan.

#### ✅ Todo List (Drag & Drop + Prioritas Eisenhower)
• Board/list dengan **drag & drop** antar kategori prioritas:  
  - **🔥 Urgent & Important**, **⚡ Important**, **⏳ Urgent**, **🍃 Optional/Low**.  
• Due date, tags, subtasks, checklist, attachments (opsional V1.1).  
• Sorting, filtering (by due date, tag, priority), search.  
• Notifikasi PWA untuk tugas **(due/overdue)**.  
• Activity log otomatis (buat, ubah, selesai).

#### ✅ Habit Tracker (Daily/Weekly/Monthly + Charts)
• Buat habit dengan frekuensi (harian/mingguan), target (mis. 5x/minggu).  
• **Checklist harian**, tampilan mingguan/bulanan.  
• Grafik sederhana (streak, completion rate).  
• Activity log (check-in, skip, edit).

#### ✅ Calendar + Planner (Local First di Origo)
• Kalender bulanan/mingguan/harian.  
• Buat event/planner block (judul, deskripsi, lokasi optional).  
• **Time suggestions** & **time blocking** dasar (drag untuk set durasi).  
• Notifikasi PWA untuk **event kalender** (before event).  
• Tanpa integrasi eksternal di V1 (Google Calendar dapat menyusul).

#### ✅ Notes & Daily Reflection (V1.1)
• Catatan ringan & template refleksi harian (What went well / Improve tomorrow).  
• Tautkan catatan ke tugas/habit/event (opsional V1.1).

#### ✅ Pomodoro (V1.1)
• Timer 25/5, custom presets, session count.  
• (Notifikasi lokal saat mulai/selesai — V1.1).

#### ✅ Activity Log (Global History)
• Timeline global lintas fitur (tugas, habit, event).  
• Filter by feature & date range.  
• Ekspor CSV (opsional V1.1).

---

### Tech Stack (Recommended Defaults):
• **Frontend:** Vite, TypeScript, React, shadcn/ui components, Tailwind CSS  
• **Backend & Storage:** Supabase (Postgres + Row Level Security)  
• **Auth:** clerk auth
• **PWA:** Installable, service worker untuk caching dasar (tanpa offline mode fungsional di V1), Web Push untuk reminder tugas & event  
• **State Management:** TanStack Query + Zustand (UI/local state)  
• **Charts:** Recharts sederhana untuk habit & dashboard

---

### Design Preferences:
• Font: Inter  
• Colors:
  - **Light mode:** background putih bersih; gunakan aksen Tailwind (sky/blue/emerald/amber/fuchsia) per komponen.
  - **Dark mode:** background abu gelap; kontras tinggi; aksen tetap colorful.  
  - Primary (saran): `#3B82F6` (Blue 500)  
  - Accent (saran): `#F59E0B` (Amber 500)  
• Layout: Mobile-first, card-based, modern UI dengan whitespace; micro-interactions halus.  
• Referensi UI: TickTick (struktur yang bersih & fokus pada tugas)

---

### Functional Requirements (MVP Scope):
• Single-user (tanpa kolaborasi/real-time).  
• Tidak ada **offline mode** di V1.  
• Reminder aktif: **tugas** (due/overdue) & **event kalender**.  
• Sorting/Filtering/Search untuk tugas & habit.  
• Drag & drop untuk Todo & time blocking di kalender harian.  
• Activity log otomatis untuk semua perubahan penting.

---

### Data Model (High-Level):
• `users`: profil & preferensi (theme, notifications).  
• `tasks`: title, description, priority (eisenhower), due_date, tags[], status, created_at, updated_at, user_id.  
• `habits`: name, schedule (daysOfWeek / perWeekTarget), notes, user_id.  
• `habit_logs`: habit_id, date, status (done/skip), note.  
• `events`: title, description, start_at, end_at, reminders[], user_id.  
• `activity_logs`: entity_type, entity_id, action, metadata(json), created_at, user_id.  
• (Opsional) `labels/tags`: untuk tugas & catatan.

---

### Key Interactions (UX Flows):
• **Add Task** (quick add) → pilih prioritas Eisenhower → set due → save → muncul di dashboard & board.  
• **Complete Habit** → tap checkbox → streak & chart update.  
• **Create Event** → drag di kalender (day/week) → isi detail → set reminder → notifikasi sesuai waktu.  
• **View Activity** → timeline dengan filter (tasks/habits/events, date range).

---

### Security & Privacy:
• Supabase RLS: setiap user hanya bisa akses datanya sendiri.  
• JWT Auth (Email & Google).  
• Rate limiting untuk push scheduling.  
• Export/delete account (V1.1 untuk compliance).

---

### Scalability Notes:
• Gunakan indexed queries (by user_id, due_date, priority).  
• Queue sederhana untuk pengiriman notifikasi (Supabase functions / cron).  
• Komponen modular agar mudah tambah fitur (Pomodoro, Notes) di V1.1.

