# Supabase Setup for Origo Productivity App

## Database Schema Setup

To set up the database schema for the Origo productivity app, run the following commands:

### 1. Using Supabase CLI (Recommended)

First, ensure you have the Supabase CLI installed:

```bash
# Install Supabase CLI
npm install -g supabase

# Sign in to your Supabase account
supabase login

# Link your project (replace with your project ref)
supabase link --project-ref your-project-ref

# Push the schema to your database
supabase db push
```

### 2. Manual Setup

If you prefer to set up the schema manually:

1. Go to your [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Go to the "SQL Editor" section
4. Create a new query
5. Copy and paste the contents of `schema.sql` file
6. Run the query

### 3. Using the schema.sql file directly

If you have direct database access, you can run:

```bash
psql -d your_supabase_connection_string -f supabase/schema.sql
```

## Environment Variables

Make sure you have the following environment variables set in your `.env.local` file:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## RLS (Row Level Security) Policies

The schema includes RLS policies to ensure users can only access their own data. These policies are automatically applied to all tables.

## Tables

The following tables are created as part of the schema:

- `profiles`: User profile information
- `tasks`: Task management with Eisenhower priority matrix
- `habits`: Habit tracking configuration
- `habit_logs`: Daily habit completion logs
- `events`: Calendar events and appointments
- `activity_logs`: Global activity timeline
- `tags`: Task and note tags

## Authentication Integration

The schema integrates with Supabase Auth to automatically create user profiles when new users sign up.