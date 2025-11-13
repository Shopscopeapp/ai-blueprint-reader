-- ============================================
-- Premium Features Database Schema
-- ============================================

-- Add analysis data column to blueprints table
ALTER TABLE public.blueprints 
ADD COLUMN IF NOT EXISTS "analysisData" JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS "autoAnalyzed" BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS "analysisStatus" TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS "ocrText" TEXT,
ADD COLUMN IF NOT EXISTS "ocrExtractedAt" TIMESTAMP WITH TIME ZONE;

-- Drop annotations table if it exists (to fix type issues)
DROP TABLE IF EXISTS public.annotations CASCADE;

-- Create annotations table for blueprint markup
CREATE TABLE public.annotations (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "blueprintId" TEXT NOT NULL REFERENCES public.blueprints(id) ON DELETE CASCADE,
  "userId" TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'note', 'highlight', 'measurement', 'arrow'
  x DECIMAL NOT NULL,
  y DECIMAL NOT NULL,
  content TEXT,
  color TEXT DEFAULT '#3b82f6',
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Drop blueprint_comparisons table if it exists (to fix type issues)
DROP TABLE IF EXISTS public.blueprint_comparisons CASCADE;

-- Create blueprint comparisons table
CREATE TABLE public.blueprint_comparisons (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId" TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  "blueprint1Id" TEXT NOT NULL REFERENCES public.blueprints(id) ON DELETE CASCADE,
  "blueprint2Id" TEXT NOT NULL REFERENCES public.blueprints(id) ON DELETE CASCADE,
  "comparisonData" JSONB DEFAULT '{}',
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE("blueprint1Id", "blueprint2Id", "userId")
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_annotations_blueprint_id ON public.annotations("blueprintId");
CREATE INDEX IF NOT EXISTS idx_annotations_user_id ON public.annotations("userId");
CREATE INDEX IF NOT EXISTS idx_comparisons_user_id ON public.blueprint_comparisons("userId");
CREATE INDEX IF NOT EXISTS idx_blueprints_analysis_status ON public.blueprints("analysisStatus");

-- Enable RLS on annotations
ALTER TABLE public.annotations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own annotations" ON public.annotations;
DROP POLICY IF EXISTS "Users can insert own annotations" ON public.annotations;
DROP POLICY IF EXISTS "Users can update own annotations" ON public.annotations;
DROP POLICY IF EXISTS "Users can delete own annotations" ON public.annotations;

CREATE POLICY "Users can read own annotations"
ON public.annotations FOR SELECT
TO authenticated
USING (auth.uid()::text = "userId");

CREATE POLICY "Users can insert own annotations"
ON public.annotations FOR INSERT
TO authenticated
WITH CHECK (auth.uid()::text = "userId");

CREATE POLICY "Users can update own annotations"
ON public.annotations FOR UPDATE
TO authenticated
USING (auth.uid()::text = "userId");

CREATE POLICY "Users can delete own annotations"
ON public.annotations FOR DELETE
TO authenticated
USING (auth.uid()::text = "userId");

-- Enable RLS on comparisons
ALTER TABLE public.blueprint_comparisons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own comparisons" ON public.blueprint_comparisons;
DROP POLICY IF EXISTS "Users can insert own comparisons" ON public.blueprint_comparisons;
DROP POLICY IF EXISTS "Users can update own comparisons" ON public.blueprint_comparisons;
DROP POLICY IF EXISTS "Users can delete own comparisons" ON public.blueprint_comparisons;

CREATE POLICY "Users can read own comparisons"
ON public.blueprint_comparisons FOR SELECT
TO authenticated
USING (auth.uid()::text = "userId");

CREATE POLICY "Users can insert own comparisons"
ON public.blueprint_comparisons FOR INSERT
TO authenticated
WITH CHECK (auth.uid()::text = "userId");

CREATE POLICY "Users can update own comparisons"
ON public.blueprint_comparisons FOR UPDATE
TO authenticated
USING (auth.uid()::text = "userId");

CREATE POLICY "Users can delete own comparisons"
ON public.blueprint_comparisons FOR DELETE
TO authenticated
USING (auth.uid()::text = "userId");

