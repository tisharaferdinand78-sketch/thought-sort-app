# Thought Sort

A modern note-taking application with AI-powered summaries built with Next.js, PostgreSQL, and Google Gemini AI.

## Features

- 🔐 **Authentication**: Secure login and registration system
- 📝 **Note Management**: Create, edit, and delete notes
- 🤖 **AI Summaries**: Automatic summary generation using Google Gemini AI
- 🔄 **Summary Regeneration**: Update AI summaries when notes are modified
- 🎨 **Modern UI**: Dark theme with glass morphism design
- 📱 **Responsive**: Works on desktop and mobile devices
- 🔍 **Search**: Search through your notes by title and content

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui
- **Authentication**: NextAuth.js
- **Database**: PostgreSQL with Prisma ORM
- **AI**: Google Gemini AI
- **Styling**: Glass morphism with dark theme

## Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Google Gemini AI API key

## Setup Instructions

1. **Clone and install dependencies**:
   ```bash
   cd thought-sort
   npm install
   ```

2. **Set up environment variables**:
   Copy `.env.example` to `.env` and fill in your values:
   ```bash
   cp .env.example .env
   ```

   Update the following variables in `.env`:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/thought_sort"

   # NextAuth.js
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"

   # Google Gemini AI
   GEMINI_API_KEY="your-gemini-api-key-here"
   ```

3. **Set up the database**:
   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run database migrations
   npx prisma migrate dev --name init

   # (Optional) Seed the database
   npx prisma db seed
   ```

4. **Get your Google Gemini API key**:
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Add it to your `.env` file

5. **Run the development server**:
   ```bash
   npm run dev
   ```

6. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

1. **Sign Up**: Create a new account or sign in with existing credentials
2. **Create Notes**: Click "New Note" to create your first note
3. **AI Summaries**: Notes automatically get AI-generated summaries
4. **Edit Notes**: Click the edit button to modify your notes
5. **Regenerate Summaries**: Use the refresh button to regenerate AI summaries
6. **Search**: Use the search bar to find specific notes
7. **Delete**: Remove notes you no longer need

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/     # NextAuth.js API routes
│   │   │   └── register/          # User registration
│   │   └── notes/                # Note CRUD operations
│   ├── auth/
│   │   ├── signin/               # Sign in page
│   │   └── signup/               # Sign up page
│   ├── dashboard/                # Main dashboard
│   └── layout.tsx                # Root layout
├── components/
│   ├── providers/                # React providers
│   └── ui/                       # shadcn/ui components
└── lib/
    ├── auth.ts                   # NextAuth configuration
    ├── gemini.ts                 # Gemini AI integration
    └── prisma.ts                 # Prisma client
```

## API Endpoints

- `POST /api/auth/register` - User registration
- `GET /api/notes` - Get all user notes
- `POST /api/notes` - Create a new note
- `GET /api/notes/[id]` - Get a specific note
- `PUT /api/notes/[id]` - Update a note
- `DELETE /api/notes/[id]` - Delete a note
- `POST /api/notes/[id]/summary` - Regenerate note summary

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.