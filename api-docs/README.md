# Reddit Clone API Documentation

This directory contains HTTP Client files for testing the Reddit Clone API using JetBrains IDEs (WebStorm, IntelliJ IDEA, etc.) or VS Code with the REST Client extension.

## Quick Start

1. **Open the project** in WebStorm or IntelliJ IDEA
2. **Select environment** - Click on the environment selector (top-right of the editor when viewing `.http` files) and choose `dev` or `prod`
3. **Run requests** - Click the green play button (▶) next to any request to execute it

## Files

| File | Description |
|------|-------------|
| `api.http` | Complete API documentation with all endpoints |
| `http-client.env.json` | Environment variables configuration |

## Environment Configuration

Edit `http-client.env.json` to configure your environment variables:

```json
{
  "dev": {
    "baseUrl": "http://localhost:3000",
    "userId": "YOUR_USER_ID",
    "postId": "YOUR_POST_ID",
    "communityId": "YOUR_COMMUNITY_ID",
    "commentId": "YOUR_COMMENT_ID",
    "conversationId": "YOUR_CONVERSATION_ID",
    "username": "testuser"
  }
}
```

## API Endpoints Summary

### Authentication (`/api/auth`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register a new user |
| POST | `/api/auth/login` | Login with email/password |
| POST | `/api/auth/google` | Google OAuth login |
| POST | `/api/auth/logout` | Logout |

### Users (`/api/users`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/profile/:username` | Get user profile |
| PUT | `/api/users/profile` | Update user profile |
| POST | `/api/users/profile/picture` | Upload profile picture |
| DELETE | `/api/users/profile/picture` | Delete profile picture |
| POST | `/api/users/save-post` | Save/unsave a post |
| GET | `/api/users/saved-posts/:userId` | Get saved posts |

### Communities (`/apis/Communityapi`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/apis/Communityapi` | Get all communities |
| GET | `/apis/Communityapi/search?q=` | Search communities |
| POST | `/apis/Communityapi` | Create a community |
| GET | `/apis/Communityapi/:communityId` | Get community by ID/name |
| GET | `/apis/Communityapi/user/:userId` | Get joined communities |
| GET | `/apis/Communityapi/owned/:userId` | Get owned communities |
| POST | `/apis/Communityapi/join` | Join a community |
| PUT | `/apis/Communityapi/:communityId` | Update community |
| POST | `/apis/Communityapi/:communityId/icon` | Upload community icon |

### Posts (`/apis/Postapi`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/apis/Postapi` | Get all posts |
| GET | `/apis/Postapi/:postId` | Get post by ID |
| POST | `/apis/Postapi` | Create a post |
| POST | `/apis/Postapi/upload` | Upload post image |
| PUT | `/apis/Postapi/:postId` | Update a post |
| DELETE | `/apis/Postapi/:postId` | Delete a post |
| POST | `/apis/Postapi/vote` | Vote on a post (legacy) |

### Votes (`/api/votes`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/votes` | Vote on a post |

### Comments (`/api/comments`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/comments/post/:postId` | Get comments for a post |
| GET | `/api/comments/post/:postId/count` | Get comment count |
| GET | `/api/comments/:commentId` | Get single comment |
| GET | `/api/comments/user/:userId` | Get user's comments |
| POST | `/api/comments` | Create a comment |
| PUT | `/api/comments/:commentId` | Update a comment |
| DELETE | `/api/comments/:commentId` | Delete a comment |
| POST | `/api/comments/:commentId/vote` | Vote on a comment |

### Chat (`/api/chat`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/chat/users` | Get all users |
| GET | `/api/chat/users/search?q=` | Search users |
| POST | `/api/chat/conversation` | Get/create conversation |
| GET | `/api/chat/conversations/:userId` | Get user's conversations |
| GET | `/api/chat/messages/:conversationId` | Get messages |
| POST | `/api/chat/message` | Send a message |

### AI Features
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chatbot/ask` | Ask AI chatbot |
| POST | `/apis/ai/summarize` | Summarize a post |

## Request/Response Examples

### Create a Post
```http
POST {{baseUrl}}/apis/Postapi
Content-Type: application/json

{
  "title": "My Post Title",
  "content": "Post content here",
  "postType": "text",
  "author": "userId",
  "community": "communityId"
}
```

**Response (201 Created):**
```json
{
  "_id": "...",
  "title": "My Post Title",
  "content": "Post content here",
  "postType": "text",
  "author": "...",
  "community": "...",
  "createdAt": "2025-12-19T..."
}
```

### Vote on a Post
```http
POST {{baseUrl}}/api/votes
Content-Type: application/json

{
  "postId": "postId",
  "userId": "userId",
  "value": 1
}
```

**Vote values:**
- `1` = Upvote
- `-1` = Downvote
- `0` = Remove vote

## Error Handling

All errors follow this format:
```json
{
  "message": "Error description"
}
```

**Status Codes:**
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

## Socket.IO Events

Connect to `ws://localhost:3000` for real-time features.

| Event | Direction | Description |
|-------|-----------|-------------|
| `join` | Client → Server | Join a conversation room |
| `sendMessage` | Client → Server | Send a message |
| `newMessage` | Server → Client | Receive a new message |
| `typing` | Both | Typing indicator |

## Tips

1. **Running sequential requests**: Use the workflow examples at the bottom of `api.http` to understand the typical request flow.

2. **Saving variables**: Response handlers (`> {% ... %}`) automatically save IDs for use in subsequent requests.

3. **File uploads**: For multipart requests, ensure your test images are in the correct path or update the file paths in the requests.

4. **VS Code**: These files also work with the "REST Client" extension in VS Code.

