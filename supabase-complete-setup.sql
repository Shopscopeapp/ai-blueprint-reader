-- ============================================
-- Complete Supabase Setup SQL Script
-- Run this entire file in Supabase SQL Editor
-- This creates everything: tables, storage, RLS policies, triggers
-- ============================================

-- ============================================
-- 1. CREATE TABLES
-- ============================================

-- Create users table (linked to Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT NOT NULL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    name TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create blueprints table
CREATE TABLE IF NOT EXISTS public.blueprints (
    id TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    filename TEXT NOT NULL,
    "supabaseUrl" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "blueprints_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create conversations table
CREATE TABLE IF NOT EXISTS public.conversations (
    id TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "blueprintId" TEXT NOT NULL,
    messages TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "conversations_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "conversations_blueprintId_fkey" FOREIGN KEY ("blueprintId") REFERENCES public.blueprints(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- ============================================
-- 2. CREATE INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS "blueprints_userId_idx" ON public.blueprints("userId");
CREATE INDEX IF NOT EXISTS "conversations_userId_idx" ON public.conversations("userId");
CREATE INDEX IF NOT EXISTS "conversations_blueprintId_idx" ON public.conversations("blueprintId");

-- ============================================
-- 3. CREATE STORAGE BUCKET
-- ============================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('blueprints', 'blueprints', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 4. STORAGE RLS POLICIES
-- ============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can upload their own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can read their own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own files" ON storage.objects;
DROP POLICY IF EXISTS "Public read access" ON storage.objects;

-- Policy: Users can upload files to their own folder
CREATE POLICY "Users can upload their own files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'blueprints' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can read their own files
CREATE POLICY "Users can read their own files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'blueprints' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can delete their own files
CREATE POLICY "Users can delete their own files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'blueprints' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- ============================================
-- 5. FUNCTION TO AUTO-CREATE USER PROFILE
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
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Trigger to call the function when a new user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 6. ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;

-- Policy: Users can read their own profile
CREATE POLICY "Users can read own profile"
ON public.users FOR SELECT
TO authenticated
USING (auth.uid()::text = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
ON public.users FOR UPDATE
TO authenticated
USING (auth.uid()::text = id);

-- Enable RLS on blueprints table
ALTER TABLE public.blueprints ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read own blueprints" ON public.blueprints;
DROP POLICY IF EXISTS "Users can insert own blueprints" ON public.blueprints;
DROP POLICY IF EXISTS "Users can delete own blueprints" ON public.blueprints;

-- Policy: Users can read their own blueprints
CREATE POLICY "Users can read own blueprints"
ON public.blueprints FOR SELECT
TO authenticated
USING (auth.uid()::text = "userId");

-- Policy: Users can insert their own blueprints
CREATE POLICY "Users can insert own blueprints"
ON public.blueprints FOR INSERT
TO authenticated
WITH CHECK (auth.uid()::text = "userId");

-- Policy: Users can delete their own blueprints
CREATE POLICY "Users can delete own blueprints"
ON public.blueprints FOR DELETE
TO authenticated
USING (auth.uid()::text = "userId");

-- Enable RLS on conversations table
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read own conversations" ON public.conversations;
DROP POLICY IF EXISTS "Users can insert own conversations" ON public.conversations;
DROP POLICY IF EXISTS "Users can update own conversations" ON public.conversations;
DROP POLICY IF EXISTS "Users can delete own conversations" ON public.conversations;

-- Policy: Users can read their own conversations
CREATE POLICY "Users can read own conversations"
ON public.conversations FOR SELECT
TO authenticated
USING (auth.uid()::text = "userId");

-- Policy: Users can insert their own conversations
CREATE POLICY "Users can insert own conversations"
ON public.conversations FOR INSERT
TO authenticated
WITH CHECK (auth.uid()::text = "userId");

-- Policy: Users can update their own conversations
CREATE POLICY "Users can update own conversations"
ON public.conversations FOR UPDATE
TO authenticated
USING (auth.uid()::text = "userId");

-- Policy: Users can delete their own conversations
CREATE POLICY "Users can delete own conversations"
ON public.conversations FOR DELETE
TO authenticated
USING (auth.uid()::text = "userId");

-- ============================================
-- SETUP COMPLETE!
-- ============================================
-- You should now have:
-- ✅ Tables: users, blueprints, conversations
-- ✅ Indexes on foreign keys
-- ✅ Storage bucket: blueprints
-- ✅ Storage RLS policies
-- ✅ User sync function and trigger
-- ✅ Database RLS policies
-- ============================================


