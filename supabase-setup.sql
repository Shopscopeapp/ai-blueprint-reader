-- ============================================
-- Supabase Setup SQL Script
-- This script creates all necessary tables and policies
-- ============================================

-- ============================================
-- 0. Create Database Tables
-- ============================================

-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blueprints table
CREATE TABLE IF NOT EXISTS public.blueprints (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId" UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  "supabaseUrl" TEXT NOT NULL,
  "fileType" TEXT NOT NULL,
  "uploadedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create conversations table
CREATE TABLE IF NOT EXISTS public.conversations (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId" UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  "blueprintId" TEXT NOT NULL REFERENCES public.blueprints(id) ON DELETE CASCADE,
  messages TEXT NOT NULL DEFAULT '[]',
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_blueprints_user_id ON public.blueprints("userId");
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON public.conversations("userId");
CREATE INDEX IF NOT EXISTS idx_conversations_blueprint_id ON public.conversations("blueprintId");

-- ============================================
-- 1. Create Storage Bucket (if not created via UI)
-- ============================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('blueprints', 'blueprints', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 2. Storage RLS Policies
-- Allow authenticated users to upload their own files
-- ============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can upload their own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can read their own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own files" ON storage.objects;
DROP POLICY IF EXISTS "Public read access" ON storage.objects;

-- Policy: Users can upload files to their own folder
-- The path structure is: {userId}/{filename} (relative to bucket)
-- storage.foldername() returns array of folder names, [1] is the first folder (userId)
CREATE POLICY "Users can upload their own files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'blueprints' AND
  -- Check if the first folder in the path matches the user's UUID
  (string_to_array(name, '/'))[1] = auth.uid()::text
);

-- Policy: Users can read their own files
CREATE POLICY "Users can read their own files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'blueprints' AND
  -- Check if the first folder in the path matches the user's UUID
  (string_to_array(name, '/'))[1] = auth.uid()::text
);

-- Policy: Users can delete their own files
CREATE POLICY "Users can delete their own files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'blueprints' AND
  -- Check if the first folder in the path matches the user's UUID
  (string_to_array(name, '/'))[1] = auth.uid()::text
);

-- Policy: Public read access (if you want files to be publicly accessible)
-- Uncomment if you want public access:
-- CREATE POLICY "Public read access"
-- ON storage.objects FOR SELECT
-- TO public
-- USING (bucket_id = 'blueprints');

-- ============================================
-- 3. Function to auto-create user profile when auth user signs up
-- ============================================

-- Drop function if exists
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, name, "createdAt", "updatedAt")
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NULL),
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE
  SET email = NEW.email,
      name = COALESCE(NEW.raw_user_meta_data->>'name', users.name),
      "updatedAt" = NOW();
  RETURN NEW;
EXCEPTION
  WHEN undefined_table THEN
    -- Table doesn't exist yet, skip
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Trigger to call the function when a new user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 4. Enable Row Level Security on your tables
-- ============================================

-- Enable RLS on users table (if table exists)
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'users') THEN
    ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
    
    -- Drop existing policies
    DROP POLICY IF EXISTS "Users can read own profile" ON public.users;
    DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
    
    -- Policy: Users can read their own profile
    CREATE POLICY "Users can read own profile"
    ON public.users FOR SELECT
    TO authenticated
    USING (auth.uid()::uuid = id::uuid);
    
    -- Policy: Users can update their own profile
    CREATE POLICY "Users can update own profile"
    ON public.users FOR UPDATE
    TO authenticated
    USING (auth.uid()::uuid = id::uuid);
  END IF;
END $$;

-- Enable RLS on blueprints table (if table exists)
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'blueprints') THEN
    ALTER TABLE public.blueprints ENABLE ROW LEVEL SECURITY;
    
    -- Drop existing policies
    DROP POLICY IF EXISTS "Users can read own blueprints" ON public.blueprints;
    DROP POLICY IF EXISTS "Users can insert own blueprints" ON public.blueprints;
    DROP POLICY IF EXISTS "Users can delete own blueprints" ON public.blueprints;
    
    -- Policy: Users can read their own blueprints
    CREATE POLICY "Users can read own blueprints"
    ON public.blueprints FOR SELECT
    TO authenticated
    USING (auth.uid()::uuid = "userId"::uuid);
    
    -- Policy: Users can insert their own blueprints
    CREATE POLICY "Users can insert own blueprints"
    ON public.blueprints FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid()::uuid = "userId"::uuid);
    
    -- Policy: Users can delete their own blueprints
    CREATE POLICY "Users can delete own blueprints"
    ON public.blueprints FOR DELETE
    TO authenticated
    USING (auth.uid()::uuid = "userId"::uuid);
  END IF;
END $$;

-- Enable RLS on conversations table (if table exists)
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'conversations') THEN
    ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
    
    -- Drop existing policies
    DROP POLICY IF EXISTS "Users can read own conversations" ON public.conversations;
    DROP POLICY IF EXISTS "Users can insert own conversations" ON public.conversations;
    DROP POLICY IF EXISTS "Users can update own conversations" ON public.conversations;
    DROP POLICY IF EXISTS "Users can delete own conversations" ON public.conversations;
    
    -- Policy: Users can read their own conversations
    CREATE POLICY "Users can read own conversations"
    ON public.conversations FOR SELECT
    TO authenticated
    USING (auth.uid()::uuid = "userId"::uuid);
    
    -- Policy: Users can insert their own conversations
    CREATE POLICY "Users can insert own conversations"
    ON public.conversations FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid()::uuid = "userId"::uuid);
    
    -- Policy: Users can update their own conversations
    CREATE POLICY "Users can update own conversations"
    ON public.conversations FOR UPDATE
    TO authenticated
    USING (auth.uid()::uuid = "userId"::uuid);
    
    -- Policy: Users can delete their own conversations
    CREATE POLICY "Users can delete own conversations"
    ON public.conversations FOR DELETE
    TO authenticated
    USING (auth.uid()::uuid = "userId"::uuid);
  END IF;
END $$;
