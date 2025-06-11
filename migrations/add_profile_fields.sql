-- Add new columns to user_profiles table
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS school TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS grade INTEGER;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS target_score INTEGER; 