# Database Setup Guide for SATez

This guide explains how to set up or repair your Supabase database schema to support the SATez app features.

## Required Database Structure

The app requires a `user_profiles` table with the following fields:

- `id` - UUID primary key linked to auth.users
- `email` - User's email address
- `name` - User's display name
- `avatar_url` - URL to the user's profile picture
- `school` - Text field for storing the user's school name
- `grade` - Integer field for storing the user's grade level
- `target_score` - Integer field for storing the user's target SAT score
- `created_at` - Timestamp for when the profile was created
- `updated_at` - Timestamp for when the profile was last updated

## Setup Options

### Option 1: Using the Admin Tools in the App (Recommended)

The easiest way to set up the database is to use the Admin Tools feature in the app:

1. Launch the SATez app
2. Go to Settings
3. Scroll down and tap on "Admin Tools"
4. Use the "Run Setup" button under "Complete Database Setup"
5. The app will create or repair the user_profiles table with all required columns

### Option 2: Using the Supabase Dashboard

If you prefer to set up the database manually:

1. Log in to your Supabase dashboard at [https://app.supabase.io](https://app.supabase.io)
2. Select your project
3. Go to the "SQL Editor" in the left sidebar
4. Create a new query
5. Copy and paste the following SQL:

```sql
-- First check if the user_profiles table exists, if not create it
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email TEXT NOT NULL,
    name TEXT,
    avatar_url TEXT,
    school TEXT,
    grade INTEGER,
    target_score INTEGER,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add any missing columns that might not exist in the table
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS school TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS grade INTEGER;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS target_score INTEGER;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- Create or replace function to automatically set updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS set_updated_at ON user_profiles;
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON user_profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create trigger to automatically create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, name)
    VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

6. Click "Run" to execute the query

### Option 3: Using Supabase CLI (For Developers)

If you're using the Supabase CLI for development:

1. Make sure you have the Supabase CLI installed and configured
2. Create a migration file with the SQL from Option 2
3. Run the migration using:

```bash
supabase db push
```

## Creating Records for Existing Users

If you already have users in your system but their profiles are missing:

```sql
-- Create profiles for all existing users who don't have one
INSERT INTO user_profiles (id, email, name)
SELECT 
    id, 
    email, 
    COALESCE(raw_user_meta_data->>'name', split_part(email, '@', 1))
FROM 
    auth.users u
WHERE 
    NOT EXISTS (SELECT 1 FROM user_profiles p WHERE p.id = u.id);
```

## Verification

To verify that the setup was successful:

1. Go to the "Table Editor" in the Supabase dashboard
2. Select the `user_profiles` table
3. Check that all the required columns exist in the schema
4. Check that there's a row for each user in your system

## Troubleshooting

If you're encountering errors:

1. Check that the RLS (Row Level Security) policies are set correctly for the user_profiles table
2. Ensure your Supabase service role key has the necessary permissions
3. If using the admin tools in the app fails, try the manual SQL option
4. Check the Supabase logs for any errors during the execution of the SQL

For further assistance, please contact the development team. 