# Origo - Backend Setup Guide

This document explains how to set up the Supabase backend for the Origo productivity app.

## Database Schema

The Origo app uses the following database schema:

### Tables

1. **profiles** - User profiles and preferences
   - `id` - UUID primary key
   - `user_id` - Clerk user ID (unique)
   - `theme_preference` - 'light', 'dark', or 'system'
   - `notification_preferences` - JSONB for notification settings
   - `created_at`, `updated_at` - Timestamps

2. **tasks** - Task management with Eisenhower matrix
   - `id` - UUID primary key
   - `user_id` - Clerk user ID
   - `title`, `description` - Task details
   - `priority` - 'urgent_important', 'important', 'urgent', 'optional'
   - `due_date` - When task is due
   - `tags` - Array of tags
   - `status` - 'todo', 'in_progress', 'done'
   - `completed_at` - When task was completed

3. **habits** - Habit tracking
   - `id` - UUID primary key
   - `user_id` - Clerk user ID
   - `name`, `description` - Habit details
   - `frequency` - 'daily', 'weekly', 'monthly'
   - `schedule` - JSONB for schedule patterns
   - `notes` - Additional notes
   - `created_at`, `updated_at` - Timestamps

4. **habit_logs** - Daily habit completion tracking
   - `id` - UUID primary key
   - `habit_id` - Reference to habit
   - `user_id` - Clerk user ID
   - `date` - Date of log
   - `status` - 'done', 'skipped', 'missed'
   - `note` - Optional note
   - `created_at` - Timestamp

5. **events** - Calendar events
   - `id` - UUID primary key
   - `user_id` - Clerk user ID
   - `title`, `description`, `location` - Event details
   - `start_at`, `end_at` - Event time range
   - `reminders` - Array of minutes before event
   - `created_at`, `updated_at` - Timestamps

6. **activity_logs** - Global activity timeline
   - `id` - UUID primary key
   - `user_id` - Clerk user ID
   - `entity_type` - 'task', 'habit', 'event', 'note'
   - `entity_id` - ID of related entity
   - `action` - 'create', 'update', 'delete', etc.
   - `metadata` - Additional data in JSONB
   - `created_at` - Timestamp

7. **tags** - Task and note tags
   - `id` - UUID primary key
   - `user_id` - Clerk user ID
   - `name` - Tag name
   - `color` - Color for UI
   - `created_at` - Timestamp

## Security

All tables use Row Level Security (RLS) policies to ensure users can only access their own data. The policies are set up as follows:

- Users can only access, create, update, and delete their own records
- The Clerk user ID (`auth.jwt() ->> 'sub'`) is used to enforce user isolation

## Triggers

The following database triggers are implemented:

- `update_updated_at_column` - Automatically updates the `updated_at` field on record changes
- `log_*_activity` - Automatically logs changes to tasks, habits, and events to the activity logs table

## Indexes

Performance indexes are created on all tables for common query patterns:

- `user_id` indexes for all user-specific tables
- `due_date` for tasks
- `start_at` for events
- `date` for habit logs
- `entity_type` and `entity_id` for activity logs