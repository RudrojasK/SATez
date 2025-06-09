-- SATez Database Setup Script
-- This script creates the necessary tables and sets up Row Level Security.
-- Run this in your Supabase SQL Editor.

-- 1. Create user_profiles table
-- This table will store public profile data.
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT UNIQUE,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.user_profiles IS 'Public profile information for each user.';

-- 2. Create vocab_practice_results table
CREATE TABLE IF NOT EXISTS public.vocab_practice_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  word TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  selected_option TEXT NOT NULL,
  correct_option TEXT NOT NULL,
  time_spent INT NOT NULL, -- in seconds
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.vocab_practice_results IS 'Stores results from vocabulary practice sessions.';

-- 3. Create reading_practice_results table
CREATE TABLE IF NOT EXISTS public.reading_practice_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  passage_id TEXT NOT NULL,
  question_id TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  selected_option TEXT NOT NULL,
  correct_option TEXT NOT NULL,
  time_spent INT NOT NULL, -- in seconds
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.reading_practice_results IS 'Stores results from reading practice sessions.';

-- 4. Create full_length_test_results table
CREATE TABLE IF NOT EXISTS public.full_length_test_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  test_id TEXT NOT NULL,
  section TEXT NOT NULL,
  total_questions INT NOT NULL,
  correct_answers INT NOT NULL,
  time_spent INT NOT NULL, -- in seconds
  score INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.full_length_test_results IS 'Stores results from full-length practice tests.';


-- 5. Set up Row Level Security (RLS) policies

-- Enable RLS for all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vocab_practice_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reading_practice_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.full_length_test_results ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own profile." ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile." ON public.user_profiles;

DROP POLICY IF EXISTS "Users can view their own vocab results." ON public.vocab_practice_results;
DROP POLICY IF EXISTS "Users can insert their own vocab results." ON public.vocab_practice_results;

DROP POLICY IF EXISTS "Users can view their own reading results." ON public.reading_practice_results;
DROP POLICY IF EXISTS "Users can insert their own reading results." ON public.reading_practice_results;

DROP POLICY IF EXISTS "Users can view their own test results." ON public.full_length_test_results;
DROP POLICY IF EXISTS "Users can insert their own test results." ON public.full_length_test_results;


-- Create RLS policies for user_profiles
CREATE POLICY "Users can view their own profile."
ON public.user_profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile."
ON public.user_profiles FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile."
ON public.user_profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);


-- Create RLS policies for vocab_practice_results
CREATE POLICY "Users can view their own vocab results."
ON public.vocab_practice_results FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own vocab results."
ON public.vocab_practice_results FOR INSERT
WITH CHECK (auth.uid() = user_id);


-- Create RLS policies for reading_practice_results
CREATE POLICY "Users can view their own reading results."
ON public.reading_practice_results FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reading results."
ON public.reading_practice_results FOR INSERT
WITH CHECK (auth.uid() = user_id);


-- Create RLS policies for full_length_test_results
CREATE POLICY "Users can view their own test results."
ON public.full_length_test_results FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own test results."
ON public.full_length_test_results FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 6. Create a trigger to automatically create a user profile on new user signup.
-- This function will be called when a new user signs up.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if it exists to avoid conflicts
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 7. Grant permissions to roles
-- Allow anon and authenticated roles to use the public schema
GRANT USAGE ON SCHEMA public TO anon, authenticated;
-- Allow anon and authenticated roles to read from all tables
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
-- Allow authenticated users to insert, update, and delete their own data
GRANT INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;

-- Grant execution on functions to roles
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Grant usage on all sequences to roles
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated; 