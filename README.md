# Thought Sort - Magic for Overthinkers 🧠✨

A modern, AI-powered note-taking application designed specifically for overthinkers who need help organizing their chaotic thoughts into structured, meaningful notes.

## 🌟 Features

### Core Functionality
- **Streamlined Note Creation**: Type your wild thoughts and press Enter to instantly create notes
- **AI-Powered Summaries**: Automatic generation of concise summaries for every note
- **Contextual AI Chat**: Intelligent conversations about your notes with AI that understands the content
- **Dual View System**: Separate Chat and Edit modes for focused interactions
- **Add AI Responses**: Capture valuable AI insights directly into your notes

### User Experience
- **Modern Dark Theme**: Beautiful glass morphism design with animated backgrounds
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Real-time Updates**: Instant synchronization between sidebar and main interface
- **Smart Placeholders**: Context-aware input prompts that guide user behavior

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Google Gemini AI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/tisharaferdinand78-sketch/thought-sort-app.git
   cd thought-sort-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL="your_postgresql_connection_string"
   
   # NextAuth.js
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your_nextauth_secret"
   
   # Google Gemini AI
   GEMINI_API_KEY="your_gemini_api_key"
   ```

4. **Set up the database**
   ```bash
   npx prisma db push
   ```

5. **Start the development server**
```bash
npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui with custom glass morphism styling
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with credentials provider
- **AI Integration**: Google Gemini AI (gemini-1.5-flash model)
- **Styling**: Custom CSS with glass morphism effects and animations

### Project Structure
```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   ├── chat/
│   │   └── notes/
│   ├── auth/
│   ├── dashboard/
│   └── globals.css
├── components/
│   ├── chat-interface.tsx
│   ├── notes-sidebar.tsx
│   └── providers/
├── lib/
│   ├── auth.ts
│   ├── gemini.ts
│   └── prisma.ts
└── prisma/
    └── schema.prisma
```

## 📱 User Guide

### Creating Notes
1. **Simple Creation**: Type your thoughts in the chat input and press Enter
2. **Auto-Title Generation**: Notes automatically get titles from the first 50 characters
3. **AI Summaries**: Every note gets an AI-generated summary for quick reference

### Chatting with AI
1. **General Chat**: Ask questions about note-taking, organization, or overthinking
2. **Note-Specific Chat**: Select a note to chat about it specifically
3. **Add Responses**: Click "Add to Note" to capture valuable AI insights

### Managing Notes
1. **View Notes**: Browse all notes in the sidebar
2. **Edit Notes**: Switch to Edit mode for detailed note modification
3. **Search**: Use the search bar to find specific notes
4. **Delete**: Remove notes you no longer need

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/signin` - User login

### Notes
- `GET /api/notes` - Fetch all user notes
- `POST /api/notes` - Create new note
- `GET /api/notes/[id]` - Fetch specific note
- `PUT /api/notes/[id]` - Update note
- `DELETE /api/notes/[id]` - Delete note
- `POST /api/notes/[id]/summary` - Regenerate AI summary

### AI Chat
- `POST /api/chat` - AI chat endpoint for contextual conversations

## 🎨 Design System

### Color Palette
- **Primary**: Dark theme with glass morphism effects
- **Accent**: Blue and purple gradients for interactive elements
- **Text**: White primary text with gray secondary text
- **Background**: Animated gradient backgrounds with floating elements

### Components
- **Glass Cards**: Semi-transparent cards with blur effects
- **Animated Backgrounds**: Subtle gradient animations
- **Interactive Elements**: Hover effects and smooth transitions
- **Responsive Layout**: Mobile-first design approach

## 🔒 Security

### Authentication
- Secure password hashing with bcrypt
- Session-based authentication with NextAuth.js
- Protected API routes with session validation

### Data Protection
- Environment variables for sensitive configuration
- Database connection security with SSL
- Input validation and sanitization

## 🚀 Deployment

### Environment Setup
1. Set up PostgreSQL database (recommended: Neon, Supabase, or Railway)
2. Configure environment variables in production
3. Set up Google Gemini AI API access

### Deployment Options
- **Vercel**: Recommended for Next.js applications
- **Netlify**: Alternative deployment platform
- **Railway**: Full-stack deployment with database

### Production Checklist
- [ ] Update `NEXTAUTH_URL` to production domain
- [ ] Generate secure `NEXTAUTH_SECRET`
- [ ] Configure production database
- [ ] Set up AI API keys
- [ ] Enable SSL/HTTPS

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Code Style
- Use TypeScript for type safety
- Follow Next.js best practices
- Maintain consistent component structure
- Add proper error handling

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **shadcn/ui** for beautiful component library
- **Google Gemini AI** for intelligent note processing
- **NextAuth.js** for secure authentication
- **Prisma** for database management
- **Tailwind CSS** for utility-first styling

## 📞 Support

For support, questions, or feature requests:
- Create an issue on GitHub
- Contact the development team
- Check the documentation for common solutions

---

**Thought Sort** - Turning chaotic thoughts into organized magic, one note at a time. ✨