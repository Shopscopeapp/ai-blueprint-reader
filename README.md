# BlueprintAI - AI Blueprint Reader Web App

A modern web application that allows users to upload building drawings (CAD files and PDFs) and ask AI questions about them using GPT-4 Vision.

## Features

- 🎨 **Modern UI**: Techy design with glassmorphism effects and gradient animations
- 📄 **File Upload**: Support for PDF, DWG, DXF, PNG, JPG, and JPEG files
- 🤖 **AI Chat**: Ask questions about blueprints using OpenAI GPT-4 Vision
- 📊 **Dashboard**: View all your blueprints and conversations
- 🔐 **Authentication**: Secure email/password authentication with Supabase
- ☁️ **Cloud Storage**: Files stored securely in Supabase Storage

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL (via Supabase Client)
- **File Storage**: Supabase Storage
- **AI**: Anthropic Claude 3.5 Sonnet (Primary), OpenAI GPT-4 Vision (Fallback)
- **OCR**: AWS Textract (Optional, for enhanced text extraction)
- **Image Processing**: Sharp (for preprocessing)
- **PDF Viewer**: react-pdf

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier available)
- Anthropic API key (for Claude 3.5 Sonnet) - [Get one here](https://console.anthropic.com/)
- (Optional) AWS account with Textract access for enhanced OCR
- (Optional) OpenAI API key as fallback

### Installation

1. **Clone the repository** (or navigate to the project directory)

2. **Install dependencies**:
```bash
npm install
```

3. **Set up Supabase**:
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to Settings > API to get your project URL and anon key
   - Go to Storage and create a bucket named `blueprints` (make it public or set up RLS policies)

4. **Set up environment variables**:
   Create a `.env` file in the root directory:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"

# Anthropic (Primary AI)
ANTHROPIC_API_KEY="your-anthropic-api-key"

# OpenAI (Optional fallback)
OPENAI_API_KEY="your-openai-api-key"

# AWS Textract (Optional, for enhanced OCR)
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_REGION="us-east-1"
```

   **To get your Supabase credentials**:
   - Go to Supabase Dashboard > Settings > API
   - Copy your project URL and anon key

5. **Set up the database tables**:
   - Go to Supabase Dashboard > SQL Editor
   - Run the SQL script from `supabase-setup.sql` to create the necessary tables
   - Or use the Supabase Table Editor to manually create the tables:
     - `users` (id, email, name, createdAt, updatedAt)
     - `blueprints` (id, userId, filename, supabaseUrl, fileType, uploadedAt)
     - `conversations` (id, userId, blueprintId, messages, createdAt, updatedAt)

6. **Set up Supabase Storage**:
   - In Supabase Dashboard, go to Storage
   - Create a bucket named `blueprints`
   - Set it to public (or configure RLS policies for authenticated users)

7. **Run the development server**:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the app.

## Project Structure

```
/
├── app/
│   ├── (auth)/          # Authentication pages
│   │   ├── login/
│   │   └── register/
│   ├── (main)/          # Protected pages
│   │   ├── dashboard/
│   │   ├── upload/
│   │   └── chat/[blueprintId]/
│   ├── api/             # API routes
│   │   ├── auth/
│   │   ├── upload/
│   │   └── chat/
│   ├── layout.tsx
│   └── page.tsx         # Landing page
├── components/
│   ├── auth/            # Authentication components
│   ├── chat/            # Chat interface
│   ├── upload/          # File upload component
│   └── viewer/          # Blueprint viewer
├── lib/
│   ├── supabase/        # Supabase client utilities
│   ├── storage.ts       # Supabase Storage utilities
│   └── openai.ts        # OpenAI client
└── public/              # Static assets
```

## Usage

1. **Sign Up**: Create an account on the landing page
2. **Upload**: Upload a blueprint file (PDF, CAD, or image)
3. **Chat**: Ask AI questions about your blueprint
4. **View**: Use zoom and pan controls to examine blueprints

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `OPENAI_API_KEY` | OpenAI API key | Yes |

## Supabase Setup

### Storage Bucket Setup

1. Go to Storage in your Supabase dashboard
2. Create a new bucket named `blueprints`
3. Make it public or configure RLS policies:
   ```sql
   -- Allow authenticated users to upload
   CREATE POLICY "Users can upload their own files"
   ON storage.objects FOR INSERT
   TO authenticated
   WITH CHECK (bucket_id = 'blueprints');

   -- Allow authenticated users to read their own files
   CREATE POLICY "Users can read their own files"
   ON storage.objects FOR SELECT
   TO authenticated
   USING (bucket_id = 'blueprints');
   ```

## Database

The app uses Supabase PostgreSQL directly via the Supabase client. The database schema includes:
- `users` - User profiles (linked to Supabase Auth)
- `blueprints` - Uploaded blueprint files
- `conversations` - AI chat conversations

All database operations are performed through the Supabase client, which provides automatic RLS (Row Level Security) support and real-time capabilities.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

Make sure to:
- Set all environment variables
- Run the database setup SQL script in your Supabase project

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.
