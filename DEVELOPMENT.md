# Thought Sort Development Guide

## Development Environment Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL database
- Git

### Initial Setup

1. **Clone and Install**
   ```bash
   git clone https://github.com/tisharaferdinand78-sketch/thought-sort-app.git
   cd thought-sort-app
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Database Setup**
   ```bash
   npx prisma db push
   npx prisma generate
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## Project Structure

```
thought-sort/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── chat/          # AI chat endpoint
│   │   │   └── notes/         # Note management endpoints
│   │   ├── auth/              # Authentication pages
│   │   ├── dashboard/         # Main application page
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/            # React components
│   │   ├── chat-interface.tsx # Main chat component
│   │   ├── notes-sidebar.tsx  # Notes sidebar component
│   │   └── providers/         # Context providers
│   ├── lib/                   # Utility libraries
│   │   ├── auth.ts           # NextAuth configuration
│   │   ├── gemini.ts         # AI integration
│   │   └── prisma.ts         # Database client
│   └── prisma/
│       └── schema.prisma      # Database schema
├── public/                    # Static assets
├── .env                       # Environment variables
├── .env.example               # Environment template
├── package.json              # Dependencies
├── tailwind.config.js        # Tailwind configuration
├── tsconfig.json             # TypeScript configuration
└── README.md                 # Project documentation
```

## Key Components

### ChatInterface Component
**Location**: `src/components/chat-interface.tsx`

**Purpose**: Main interface for note creation, AI chat, and note editing

**Key Features**:
- Streamlined note creation (type → Enter)
- Contextual AI chat about selected notes
- "Add to Note" functionality for AI responses
- Dual view system (Chat/Edit modes)

**State Management**:
```typescript
const [messages, setMessages] = useState<Message[]>([])
const [inputValue, setInputValue] = useState("")
const [viewMode, setViewMode] = useState<"chat" | "edit">("chat")
const [selectedNote, setSelectedNote] = useState<Note | null>(null)
```

### NotesSidebar Component
**Location**: `src/components/notes-sidebar.tsx`

**Purpose**: Displays list of notes with search and selection functionality

**Key Features**:
- Note list with search functionality
- Note selection and highlighting
- Real-time updates when notes are modified

### API Routes

#### Notes API (`/api/notes`)
- `GET`: Fetch all user notes
- `POST`: Create new note with AI summary
- `PUT`: Update note content
- `DELETE`: Remove note

#### Chat API (`/api/chat`)
- `POST`: AI-powered chat with contextual responses

#### Auth API (`/api/auth`)
- `POST /register`: User registration
- `POST /signin`: User authentication

## Database Schema

### Prisma Models

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  password      String
  name          String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  notes         Note[]
  accounts      Account[]
  sessions      Session[]
}

model Note {
  id        String   @id @default(cuid())
  title     String
  content   String
  summary   String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

## AI Integration

### Gemini AI Setup
**Location**: `src/lib/gemini.ts`

**Functions**:
- `generateSummary(content: string)`: Creates AI summaries for notes
- `chatAboutNote(noteContent, noteTitle, userMessage)`: Contextual note discussions
- `chatGeneral(userMessage)`: General AI assistance

**Model**: `gemini-1.5-flash`

**Usage Example**:
```typescript
const summary = await generateSummary("My note content...")
const response = await chatAboutNote(noteContent, noteTitle, "What are the main themes?")
```

## Styling System

### Tailwind Configuration
**File**: `tailwind.config.js`

**Custom Classes**:
- `.glass`: Glass morphism effect
- `.glass-card`: Card with glass effect
- `.glass-input`: Input with glass effect
- `.animated-bg`: Animated background

### CSS Variables
**File**: `src/app/globals.css`

```css
:root {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 217.2 91.2% 59.8%;
  --secondary: 215 27.9% 16.9%;
  --muted: 215 27.9% 16.9%;
  --accent: 215 27.9% 16.9%;
  --destructive: 0 62.8% 30.6%;
  --border: 215 27.9% 16.9%;
  --input: 215 27.9% 16.9%;
  --ring: 217.2 91.2% 59.8%;
}
```

## Development Workflow

### Adding New Features

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/new-feature
   ```

2. **Develop Feature**
   - Add components in `src/components/`
   - Add API routes in `src/app/api/`
   - Update database schema if needed
   - Add tests if applicable

3. **Test Thoroughly**
   - Test in development environment
   - Verify API endpoints
   - Check responsive design
   - Test AI integration

4. **Commit and Push**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   git push origin feature/new-feature
   ```

### Database Changes

1. **Update Schema**
   ```prisma
   // Edit src/prisma/schema.prisma
   ```

2. **Apply Changes**
   ```bash
   npx prisma db push
   npx prisma generate
   ```

3. **Update Types**
   ```bash
   npm run build
   ```

### Environment Variables

**Required Variables**:
```env
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret"
GEMINI_API_KEY="your-gemini-key"
```

## Testing

### Manual Testing Checklist

- [ ] User registration and login
- [ ] Note creation and editing
- [ ] AI chat functionality
- [ ] "Add to Note" feature
- [ ] Responsive design
- [ ] Error handling

### API Testing

Use tools like Postman or curl:

```bash
# Test note creation
curl -X POST http://localhost:3000/api/notes \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=token" \
  -d '{"title": "Test", "content": "Test content"}'
```

## Debugging

### Common Issues

1. **Database Connection**
   - Check `DATABASE_URL` in `.env`
   - Verify database is running
   - Run `npx prisma db push`

2. **AI Integration**
   - Verify `GEMINI_API_KEY` is set
   - Check API key permissions
   - Monitor rate limits

3. **Authentication**
   - Check `NEXTAUTH_SECRET` is set
   - Verify session configuration
   - Clear browser cookies if needed

### Debug Tools

- **Browser DevTools**: Network tab for API calls
- **Prisma Studio**: `npx prisma studio`
- **Console Logs**: Check server console for errors

## Performance Optimization

### Frontend
- Use React.memo for expensive components
- Implement virtual scrolling for large note lists
- Optimize images and assets
- Use Next.js Image component

### Backend
- Implement database indexing
- Add API response caching
- Optimize AI API calls
- Use connection pooling

### Database
- Add indexes for frequently queried fields
- Implement pagination for large datasets
- Use database views for complex queries

## Security Considerations

### Authentication
- Secure password hashing with bcrypt
- Session-based authentication
- CSRF protection with NextAuth.js

### API Security
- Input validation and sanitization
- Rate limiting (to be implemented)
- SQL injection protection via Prisma

### Data Protection
- Environment variable security
- Database connection encryption
- Secure cookie configuration

## Deployment

### Production Checklist
- [ ] Update environment variables
- [ ] Configure production database
- [ ] Set up AI API keys
- [ ] Enable HTTPS
- [ ] Configure domain settings
- [ ] Set up monitoring
- [ ] Test all functionality

### Deployment Platforms
- **Vercel**: Recommended for Next.js
- **Netlify**: Alternative option
- **Railway**: Full-stack deployment

## Contributing

### Code Standards
- Use TypeScript for type safety
- Follow Next.js best practices
- Maintain consistent component structure
- Add proper error handling
- Write clear commit messages

### Pull Request Process
1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request
6. Address review feedback

## Resources

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Google Gemini AI Documentation](https://ai.google.dev/docs)

### Tools
- [Prisma Studio](https://www.prisma.io/studio)
- [Next.js DevTools](https://nextjs.org/docs/advanced-features/debugging)
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)
