# Thought Sort API Documentation

## Overview

The Thought Sort API provides endpoints for user authentication, note management, and AI-powered chat functionality. All endpoints require authentication except for registration and login.

## Base URL
```
http://localhost:3000/api
```

## Authentication

All protected endpoints require a valid session cookie. Authentication is handled by NextAuth.js.

## Endpoints

### Authentication

#### Register User
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

#### Sign In
```http
POST /api/auth/signin
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### Notes

#### Get All Notes
```http
GET /api/notes
```

**Headers:**
```
Cookie: next-auth.session-token=session_token
```

**Response:**
```json
[
  {
    "id": "note_id",
    "title": "Note Title",
    "content": "Note content...",
    "summary": "AI-generated summary...",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "userId": "user_id"
  }
]
```

#### Create Note
```http
POST /api/notes
```

**Request Body:**
```json
{
  "title": "Note Title",
  "content": "Note content..."
}
```

**Response:**
```json
{
  "id": "note_id",
  "title": "Note Title",
  "content": "Note content...",
  "summary": "AI-generated summary...",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "userId": "user_id"
}
```

#### Get Single Note
```http
GET /api/notes/[id]
```

**Response:**
```json
{
  "id": "note_id",
  "title": "Note Title",
  "content": "Note content...",
  "summary": "AI-generated summary...",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "userId": "user_id"
}
```

#### Update Note
```http
PUT /api/notes/[id]
```

**Request Body:**
```json
{
  "title": "Updated Title",
  "content": "Updated content...",
  "regenerateSummary": true
}
```

**Response:**
```json
{
  "id": "note_id",
  "title": "Updated Title",
  "content": "Updated content...",
  "summary": "New AI-generated summary...",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "userId": "user_id"
}
```

#### Delete Note
```http
DELETE /api/notes/[id]
```

**Response:**
```json
{
  "message": "Note deleted successfully"
}
```

#### Regenerate Summary
```http
POST /api/notes/[id]/summary
```

**Response:**
```json
{
  "id": "note_id",
  "title": "Note Title",
  "content": "Note content...",
  "summary": "New AI-generated summary...",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "userId": "user_id"
}
```

### AI Chat

#### Chat with AI
```http
POST /api/chat
```

**Request Body (General Chat):**
```json
{
  "message": "How can I organize my thoughts better?"
}
```

**Request Body (Note-Specific Chat):**
```json
{
  "message": "What are the main themes in this note?",
  "noteId": "note_id",
  "noteContent": "Note content...",
  "noteTitle": "Note Title"
}
```

**Response:**
```json
{
  "response": "AI-generated response based on the context..."
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Title and content are required"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "error": "Note not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

## Rate Limiting

Currently, there are no rate limits implemented. Consider implementing rate limiting for production use.

## AI Integration

### Gemini AI Model
- **Model**: `gemini-1.5-flash`
- **Usage**: Note summarization and contextual chat responses
- **API Key**: Required in environment variables

### AI Features
1. **Automatic Summarization**: Every note gets an AI-generated summary
2. **Contextual Chat**: AI understands note content for relevant responses
3. **General Assistance**: Help with note-taking and organization strategies

## Database Schema

### Users Table
```sql
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
```

### Notes Table
```sql
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

## Security Considerations

1. **Authentication**: All endpoints require valid session tokens
2. **Input Validation**: All inputs are validated and sanitized
3. **SQL Injection**: Protected by Prisma ORM
4. **CORS**: Configured for same-origin requests
5. **Environment Variables**: Sensitive data stored in environment variables

## Testing

### Manual Testing
Use tools like Postman or curl to test API endpoints:

```bash
# Test note creation
curl -X POST http://localhost:3000/api/notes \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=your_token" \
  -d '{"title": "Test Note", "content": "Test content"}'
```

### Automated Testing
Consider implementing Jest tests for API endpoints in production.

## Monitoring

### Logging
- All API requests are logged
- Error responses include detailed error information
- AI API calls are monitored for rate limits

### Metrics
- Track API response times
- Monitor AI usage and costs
- User engagement metrics

## Future Enhancements

1. **Rate Limiting**: Implement per-user rate limits
2. **Caching**: Add Redis caching for frequently accessed notes
3. **Webhooks**: Support for external integrations
4. **Batch Operations**: Bulk note operations
5. **Export/Import**: Note export functionality
6. **Collaboration**: Shared notes and real-time editing
