# V-Network — Full-Featured MERN Social Media Platform

> A production-ready, full-stack MERN (MongoDB, Express, React, Node.js) social networking application inspired by Instagram, featuring real-time messaging, WebRTC video/audio calling, instant notifications, interactive social feeds, and dark mode support.

---

## 🌟 Key Features

### 🔐 **Authentication & Security**
- **JWT Dual-Token System**: Access tokens (JSON Web Tokens) paired with secure HTTP-only Refresh Token cookies for seamless authentication persistence.
- **Bcrypt Encryption**: Password hashing using `bcrypt` (12 salt rounds).
- **Protected Middleware**: Server-side token validation protecting REST API endpoints.

### 📱 **Social Feed & Interactivity**
- **Interactive Feed**: Dynamic home feed displaying posts from followed users with pagination.
- **Media Support**: Multi-image uploads and rich text captions.
- **Likes & Comments**: Real-time like/unlike system, top-level comments, and nested comment replies.
- **Bookmarking**: Save/unsave favorite posts to a personal collection.
- **Discover Feed**: Explore trending posts from users you don't follow yet.

### 👥 **User Profiles & Relationships**
- **Profile Management**: Customizable avatar, bio/story, website link, gender, and contact details.
- **Follow System**: Real-time follow/unfollow mechanisms with dynamic follower/following counts.
- **User Search & Recommendations**: Instant user search bar and AI-driven "Suggested Users" recommendations.

### 💬 **Real-time Chat & WebRTC Calling**
- **Instant Messaging**: Low-latency 1-on-1 direct chat powered by **Socket.io**.
- **Real-Time Online Presence**: Live online/offline status indicators for followed users.
- **P2P Video & Audio Calls**: Integrated **PeerJS (WebRTC)** for high-definition browser-to-browser voice and video calling.

### 🔔 **Notification System**
- **Real-Time Alerts**: Instant socket notifications for likes, comments, new followers, and direct messages.
- **Desktop Notifications**: Browser-native push notification integrations.

### 🎨 **Modern UI & UX**
- **Responsive Layout**: Mobile-first responsive UI built with custom CSS and Bootstrap 5.
- **Dark / Light Mode**: Theme switching with CSS state controls.

---

## 🛠️ Tech Stack

| Domain                 | Technology                   | Description                                           |
| :--------------------- | :--------------------------- | :---------------------------------------------------- |
| **Frontend Framework** | **React.js 17**              | Component-based UI library                            |
| **State Management**   | **Redux & Redux Thunk**      | Global state & asynchronous action management         |
| **Styling & UI**       | **Custom CSS3, Bootstrap 5** | Responsive grid, glassmorphism, and custom animations |
| **Backend Runtime**    | **Node.js & Express.js**     | High-performance RESTful API server                   |
| **Database**           | **MongoDB & Mongoose ORM**   | Document database with schema validation              |
| **Real-Time Engine**   | **Socket.io 3**              | WebSockets for messaging and presence                 |
| **WebRTC Calling**     | **PeerJS & PeerServer**      | Peer-to-peer audio/video streaming                    |
| **Authentication**     | **JWT & Cookie-Parser**      | Secure cookie-based session handling                  |

---

## 📁 Project Architecture

```
Project/
├── config/
│   └── db.js                 # MongoDB connection setup
├── controllers/
│   ├── authCtrl.js           # Auth handlers (Register, Login, Refresh, Logout)
│   ├── userCtrl.js           # User profile & relationship handlers
│   ├── postCtrl.js           # Post CRUD, feed, & bookmark handlers
│   ├── commentCtrl.js        # Comment & reply handlers
│   ├── notifyCtrl.js         # Notification CRUD & mark-as-read
│   └── messageCtrl.js        # Direct messaging & conversation handlers
├── middleware/
│   └── auth.js               # JWT authentication middleware
├── models/
│   ├── userModel.js          # Mongoose schema for User
│   ├── postModel.js          # Mongoose schema for Post
│   ├── commentModel.js       # Mongoose schema for Comment
│   ├── notifyModel.js        # Mongoose schema for Notification
│   ├── messageModel.js       # Mongoose schema for Message
│   └── conversationModel.js # Mongoose schema for Conversation
├── routes/                   # Express REST API routes
├── socketServer.js           # Socket.io event listener logic & PeerJS call signaling
├── server.js                 # Server entrypoint & HTTP setup
└── client/                   # React Frontend Application
    ├── public/
    │   └── index.html        # HTML template & CDN imports
    └── src/
        ├── components/       # Reusable React UI components
        ├── pages/            # Page-level components (Home, Login, Profile, etc.)
        ├── redux/            # Redux store, actions, and reducers
        └── styles/           # App stylesheets
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: `v16.x` or higher (`v22+` compatible)
- **npm**: `v8.x` or higher
- **MongoDB**: Active connection string (Local or MongoDB Atlas)

### 1. Environment Configuration

Create a `.env` file in the project root directory (`Project/.env`):

```env
PORT=5000

JWT_EXPIRE=5d

COOKIE_EXPIRE=5

FRONTEND_URL="http://localhost:3000"

CLOUDINARY_NAME="dyplegxqx"
CLOUDINARY_API_KEY="645255372492755"
CLOUDINARY_API_SECRET="ymPXB1c7JubKhc7VMqPQihrVQic"
ACCESS_TOKEN_SECRET = myacceestoken001
REFRESH_TOKEN_SECRET = myrefreshtoken001

MONGODB_USERNAME="elgunezmemmedov_db_user"
MONGODB_PASSWORD="YwTcsECe0zoyTsHA"
MONGO="mongodb+srv://elgunezmemmedov_db_user:YwTcsECe0zoyTsHA@cluster0.oifde6h.mongodb.net"
```

### 2. Install Server Dependencies & Start Backend

From the project root folder:

```bash
# Install server dependencies
npm install

# Start Express & Socket.io server
npm start
```
*The server will run on `http://localhost:5000` and PeerServer on port `3001`.*

### 3. Install Client Dependencies & Start Frontend

Open a new terminal tab and navigate to the `client` directory:

```bash
cd client

# Install client dependencies
npm install --legacy-peer-deps

# Launch React Development Server
npm start
```
*The application will open automatically at `http://localhost:3000`.*

---

## 🔑 API Authentication & Authorization Header Guide

All protected REST API endpoints require a valid JWT access token passed in the **`Authorization`** HTTP header.

### 1. Obtaining Access Token on Login / Registration
When you log in (`POST /api/login`) or register (`POST /api/register`), the server returns an `access_token` in the JSON response:

```json
{
  "msg": "Login Success!",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhYzg5NjNhMzFjYzc4Y2FhMDA0MjUxMCIsImlhdCI6MTc5MTUzMDY0NSwiZXhwIjoxNzkxNjE3MDQ1fQ.260ATEmkh2xcwtj-JmWR3wt8rq7HxCzQKxMoeclyRw0",
  "user": {
    "_id": "6ac8963a31cc78caa0042510",
    "username": "johndoe",
    "email": "johndoe@example.com"
  }
}
```

### 2. Passing Token in Postman / Client Requests
To test private endpoints (e.g., `GET /api/user/:id`, `POST /api/posts`, `GET /api/conversations`), attach the `access_token` under the **Headers** tab in Postman or your HTTP client:

| Key                 | Value                                                                                                                                                                         |
| :------------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`Authorization`** | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhYzg5NjNhMzFjYzc4Y2FhMDA0MjUxMCIsImlhdCI6MTc5MTUzMDY0NSwiZXhwIjoxNzkxNjE3MDQ1fQ.260ATEmkh2xcwtj-JmWR3wt8rq7HxCzQKxMoeclyRw0` |

---

## 📸 Post Creation & Cloudinary Image Upload Guide (`POST /api/posts`)

Creating a post involves uploading media to Cloudinary and attaching the resulting image URL array to the post creation endpoint.

### Step 1: Upload Image to Cloudinary in Postman (Optional / Direct Upload)
- **HTTP Method**: `POST`
- **URL**: `https://api.cloudinary.com/v1_1/dyplegxqx/upload`
- **Body Tab**: Choose **form-data**:

| Key             | Type     | Value                | Description                       |
| :-------------- | :------- | :------------------- | :-------------------------------- |
| `file`          | **File** | `<select_image.png>` | Local image file from your disk   |
| `upload_preset` | **Text** | `utwsyu1s`           | Cloudinary unsigned upload preset |

*Response returns `secure_url` and `public_id`.*

---

### Step 2: Create New Post on Express API (`POST /api/posts`)
- **HTTP Method**: `POST`
- **URL**: `http://localhost:5000/api/posts`
- **Headers Tab**:
  - `Authorization`: `<your_access_token>`
  - `Content-Type`: `application/json`
- **Body Tab**: Choose **raw** -> **JSON**:

```json
{
  "content": "Hello world! This is my first post on V-Network.",
  "images": [
    {
      "public_id": "v-social/sample_id",
      "url": "https://res.cloudinary.com/dyplegxqx/image/upload/v1673522466/v-social/sample.jpg"
    }
  ]
}
```

---

## 💬 Direct Messaging & Chat History Guide

### Send Direct Message (`POST /api/message`)
- **HTTP Method**: `POST`
- **URL**: `http://localhost:5000/api/message`
- **Headers Tab**: `Authorization: <your_access_token>`, `Content-Type: application/json`
- **Body Tab**: Choose **raw** -> **JSON**:

```json
{
  "recipient": "6ac8963a31cc78caa0042510",
  "text": "Hello! How are you doing today?",
  "media": []
}
```

### Fetch Chat History with a User (`GET /api/message/:id`)
- **HTTP Method**: `GET`
- **URL**: `http://localhost:5000/api/message/<recipient_user_id>`
- **Headers Tab**: `Authorization: <your_access_token>`

> ⚠️ **Important**: Replace `<recipient_user_id>` with the **User ID** of the person you are chatting with (e.g. `6ac8985a31cc78caa004251e`), **NOT** a Message Document ID!

---

## 📡 REST API Reference

### 🗝️ Authentication Endpoints
| Method | Endpoint             | Description                      | Access          |
| :----- | :------------------- | :------------------------------- | :-------------- |
| `POST` | `/api/register`      | Register a new user              | Public          |
| `POST` | `/api/login`         | Authenticate user & issue tokens | Public          |
| `POST` | `/api/logout`        | Clear refresh token cookie       | Public          |
| `POST` | `/api/refresh_token` | Issue new access token           | Public (Cookie) |

### 👤 User Endpoints
| Method  | Endpoint                 | Description              | Access                                  |
| :------ | :----------------------- | :----------------------- | :-------------------------------------- |
| `GET`   | `/api/search`            | Search users by username | Private (Requires Authorization Header) |
| `GET`   | `/api/user/:id`          | Get user profile data    | Private (Requires Authorization Header) |
| `PATCH` | `/api/user`              | Update user profile info | Private (Requires Authorization Header) |
| `PATCH` | `/api/user/:id/follow`   | Follow a user            | Private (Requires Authorization Header) |
| `PATCH` | `/api/user/:id/unfollow` | Unfollow a user          | Private (Requires Authorization Header) |
| `GET`   | `/api/suggestionsUser`   | Get suggested users list | Private (Requires Authorization Header) |

### 📸 Post Endpoints
| Method   | Endpoint               | Description                | Access                                  |
| :------- | :--------------------- | :------------------------- | :-------------------------------------- |
| `POST`   | `/api/posts`           | Create a new post          | Private (Requires Authorization Header) |
| `GET`    | `/api/posts`           | Get home feed posts        | Private (Requires Authorization Header) |
| `GET`    | `/api/post/:id`        | Get single post details    | Private (Requires Authorization Header) |
| `PATCH`  | `/api/post/:id`        | Update post content        | Private (Requires Authorization Header) |
| `DELETE` | `/api/post/:id`        | Delete post                | Private (Requires Authorization Header) |
| `PATCH`  | `/api/post/:id/like`   | Like a post                | Private (Requires Authorization Header) |
| `PATCH`  | `/api/post/:id/unlike` | Unlike a post              | Private (Requires Authorization Header) |
| `GET`    | `/api/post_discover`   | Fetch discovery feed posts | Private (Requires Authorization Header) |
| `PATCH`  | `/api/savePost/:id`    | Save/Bookmark post         | Private (Requires Authorization Header) |
| `PATCH`  | `/api/unSavePost/:id`  | Unsave post                | Private (Requires Authorization Header) |
| `GET`    | `/api/getSavePosts`    | Fetch saved posts          | Private (Requires Authorization Header) |

### 💬 Messaging & Call Endpoints
| Method   | Endpoint                | Description                                             | Access                                  |
| :------- | :---------------------- | :------------------------------------------------------ | :-------------------------------------- |
| `POST`   | `/api/message`          | Send direct message / call log                          | Private (Requires Authorization Header) |
| `GET`    | `/api/conversations`    | Get user conversation threads                           | Private (Requires Authorization Header) |
| `GET`    | `/api/message/:id`      | Get message history with user (:id = Recipient User ID) | Private (Requires Authorization Header) |
| `DELETE` | `/api/message/:id`      | Delete specific message                                 | Private (Requires Authorization Header) |
| `DELETE` | `/api/conversation/:id` | Delete conversation thread                              | Private (Requires Authorization Header) |

---

## 👨‍💻 License

This project is open-source under the [ISC License](LICENSE).
