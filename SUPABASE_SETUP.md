# Supabase Setup Instructions

## ⚠️ IMPORTANT: Follow these steps in order!

## Step 1: Set Up Environment Variables

Make sure you have a `.env` file in the root directory with:

```env
NEXT_PUBLIC_SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key-here"
OPENAI_API_KEY="your-openai-api-key-here"
```

**Note:** You no longer need `DATABASE_URL` - the app uses Supabase client directly!

## Step 2: Create Database Tables

You have two options:

### Option A: Use SQL Script (Recommended)

1. Go to your Supabase Dashboard
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the contents of `supabase-setup.sql`
5. Click **Run** (or press Ctrl+Enter)

This will create:
- The `users`, `blueprints`, and `conversations` tables
- The `blueprints` storage bucket
- RLS (Row Level Security) policies
- A function to auto-sync users when they sign up

### Option B: Use Table Editor

1. Go to **Table Editor** in Supabase Dashboard
2. Create the following tables manually:

**users table:**
- `id` (uuid, primary key)
- `email` (text, unique)
- `name` (text, nullable)
- `createdAt` (timestamp, default now())
- `updatedAt` (timestamp, default now())

**blueprints table:**
- `id` (text, primary key, default: cuid())
- `userId` (uuid, foreign key to users.id)
- `filename` (text)
- `supabaseUrl` (text)
- `fileType` (text)
- `uploadedAt` (timestamp, default now())

**conversations table:**
- `id` (text, primary key, default: cuid())
- `userId` (uuid, foreign key to users.id)
- `blueprintId` (text, foreign key to blueprints.id)
- `messages` (text, JSON string)
- `createdAt` (timestamp, default now())
- `updatedAt` (timestamp, default now())

Then run the SQL script for RLS policies and storage setup.

## Step 4: Create Storage Bucket (Alternative - via UI)

If you prefer using the UI instead of SQL:

1. Go to **Storage** in Supabase Dashboard
2. Click **New Bucket**
3. Name: `blueprints`
4. Public bucket: **Yes** (or configure RLS policies)
5. Click **Create Bucket**

Then you still need to run the SQL script for RLS policies and user sync function.

## Step 5: Verify Setup

After setting up:

1. Check **Table Editor** - you should see `users`, `blueprints`, and `conversations` tables
2. Check **Storage** - you should see the `blueprints` bucket
3. Check **Authentication** - test sign up/login

## Troubleshooting

### Error: "relation 'public.users' does not exist"
- **Solution:** Make sure you've created the database tables (either via SQL script or Table Editor)
- Verify the table names match exactly: `users`, `blueprints`, `conversations`

### Error: "Environment variable not found"
- **Solution:** Create a `.env` file in the root directory with your Supabase credentials
- Make sure you have `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` set

### Storage uploads fail
- Verify the bucket name is exactly `blueprints`
- Check that RLS policies are set up correctly
- Make sure the bucket is public OR RLS policies allow authenticated access

### User sync not working
- Check that the trigger was created: Go to Database > Functions in Supabase
- Verify the `handle_new_user()` function exists
- Check that the trigger `on_auth_user_created` exists on `auth.users`
