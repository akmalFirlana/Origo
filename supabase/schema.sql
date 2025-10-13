-- Supabase Database Schema for Origo Productivity App

-- Enable Row Level Security (RLS)
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
CREATE POLICY "Users can view their own tasks" ON public.tasks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tasks" ON public.tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks" ON public.tasks
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks" ON public.tasks
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own habits" ON public.habits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own habits" ON public.habits
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own habits" ON public.habits
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own habits" ON public.habits
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own habit_logs" ON public.habit_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own habit_logs" ON public.habit_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own habit_logs" ON public.habit_logs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own habit_logs" ON public.habit_logs
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own events" ON public.events
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own events" ON public.events
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own events" ON public.events
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own events" ON public.events
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own activity_logs" ON public.activity_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own activity_logs" ON public.activity_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own activity_logs" ON public.activity_logs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own activity_logs" ON public.activity_logs
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own profiles" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profiles" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profiles" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own profiles" ON public.profiles
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own tags" ON public.tags
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tags" ON public.tags
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tags" ON public.tags
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tags" ON public.tags
  FOR DELETE USING (auth.uid() = user_id);

-- Create tables in the correct order respecting foreign key dependencies
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  theme_preference TEXT DEFAULT 'system'::text,
  notification_preferences JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.habits (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  frequency TEXT DEFAULT 'daily'::text CHECK (frequency = ANY (ARRAY['daily'::text, 'weekly'::text, 'monthly'::text])),
  schedule JSONB DEFAULT '{}'::jsonb,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT habits_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT CHECK (priority = ANY (ARRAY['urgent_important'::text, 'important'::text, 'urgent'::text, 'optional'::text])),
  due_date TIMESTAMP WITH TIME ZONE,
  tags TEXT[] DEFAULT '{}'::text[],
  status TEXT DEFAULT 'todo'::text CHECK (status = ANY (ARRAY['todo'::text, 'in_progress'::text, 'done'::text])),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  CONSTRAINT tasks_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  start_at TIMESTAMP WITH TIME ZONE NOT NULL,
  end_at TIMESTAMP WITH TIME ZONE NOT NULL,
  reminders INTEGER[] DEFAULT '{}'::integer[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT events_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.habit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  habit_id UUID,
  user_id UUID NOT NULL,
  date DATE NOT NULL,
  status TEXT DEFAULT 'missed'::text CHECK (status = ANY (ARRAY['done'::text, 'skipped'::text, 'missed'::text])),
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT habit_logs_pkey PRIMARY KEY (id),
  CONSTRAINT habit_logs_habit_id_fkey FOREIGN KEY (habit_id) REFERENCES public.habits(id)
);

CREATE TABLE IF NOT EXISTS public.tags (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT tags_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  entity_type TEXT NOT NULL CHECK (entity_type = ANY (ARRAY['task'::text, 'habit'::text, 'event'::text, 'note'::text])),
  entity_id UUID NOT NULL,
  action TEXT NOT NULL CHECK (action = ANY (ARRAY['create'::text, 'update'::text, 'delete'::text, 'complete'::text, 'incomplete'::text, 'check'::text, 'uncheck'::text, 'skip'::text])),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT activity_logs_pkey PRIMARY KEY (id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON public.tasks (user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON public.tasks (due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON public.tasks (priority);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks (status);

CREATE INDEX IF NOT EXISTS idx_habits_user_id ON public.habits (user_id);
CREATE INDEX IF NOT EXISTS idx_habit_logs_user_id ON public.habit_logs (user_id);
CREATE INDEX IF NOT EXISTS idx_habit_logs_habit_id ON public.habit_logs (habit_id);
CREATE INDEX IF NOT EXISTS idx_habit_logs_date ON public.habit_logs (date);

CREATE INDEX IF NOT EXISTS idx_events_user_id ON public.events (user_id);
CREATE INDEX IF NOT EXISTS idx_events_start_at ON public.events (start_at);

CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON public.activity_logs (user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_entity_type ON public.activity_logs (entity_type);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs (created_at);

CREATE INDEX IF NOT EXISTS idx_tags_user_id ON public.tags (user_id);

-- Update updated_at column automatically
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_profiles_updated_at 
  BEFORE UPDATE ON public.profiles 
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_tasks_updated_at 
  BEFORE UPDATE ON public.tasks 
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_habits_updated_at 
  BEFORE UPDATE ON public.habits 
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_events_updated_at 
  BEFORE UPDATE ON public.events 
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Function to create profile automatically when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
