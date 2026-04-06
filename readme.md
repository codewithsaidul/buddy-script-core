# BuddyScript Core - Social Platform API

BuddyScript is a robust Backend API built with **Node.js, Express, and MongoDB** using **TypeScript**. It features a scalable module-based architecture, advanced querying, and secure authentication.

## 🚀 Features

* **Authentication:** JWT-based authentication with Passport.js and secure cookie handling.
* **Post Management:** Create, update, and soft-delete posts with visibility controls (Public/Private).
* **Query Builder:** Advanced filtering, sorting, pagination, and field selection.
* **Commenting System:** Interactive comment system for user engagement.
* **File Upload:** Cloudinary integration for profile and post images.
* **Validation:** Schema-based validation using Zod.

---

## 🛠️ Tech Stack

* **Runtime:** Bun / Node.js
* **Framework:** Express.js
* **Language:** TypeScript
* **Database:** MongoDB (Mongoose)
* **Validation:** Zod
* **Storage:** Cloudinary

---

## 📂 Project Structure

```text
src
├── app
│   ├── config          # Configuration files (DB, Cloudinary, Passport)
│   ├── middleware      # Global middlewares (Auth, Error Handler, Validation)
│   ├── modules         # Business Logic (User, Post, Auth, Comments)
│   └── utils           # Helper functions (QueryBuilder, JWT, catchAsync)
└── server.ts           # Entry point

```



---

## 🛣️ API Endpoints

### 🔐 Authentication (`/api/v1/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| **POST** | `/register` | Register a new user (with profile image) | ❌ |
| **POST** | `/login` | Login with credentials | ❌ |
| **POST** | `/refresh-token` | Get new access token | ❌ |
| **POST** | `/logout` | Clear user session | ❌ |
| **GET** | `/me` | Get current user info | ✅ |

---

### 👤 User Profile (`/api/v1/users`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| **GET** | `/me` | Get user profile details | ✅ |
| **PATCH** | `/:userId` | Update user information | ✅ |

---

### 📝 Posts (`/api/v1/posts`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| **POST** | `/` | Create a new post (with image) | ✅ |
| **GET** | `/` | Get all posts (with filtering/sorting) | ✅ |
| **PATCH** | `/:postId` | Update a specific post | ✅ |
| **DELETE** | `/:postId` | Soft delete a post | ✅ |
| **PATCH** | `/:postId/like` | Toggle like on a post | ✅ |

---

### 💬 Comments (`/api/v1/posts/:postId/comments`)
*Note: These routes use `mergeParams: true` to access `postId`.*

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| **POST** | `/` | Add a comment to a post | ✅ |
| **GET** | `/` | Get all comments for a post | ✅ |
| **GET** | `/:commentId/replies` | Get replies for a specific comment | ✅ |
| **PATCH** | `/:commentId/like` | Toggle like on a comment | ✅ |
| **DELETE** | `/:commentId` | Delete a comment | ✅ |

---






## ⚙️ Getting Started

### Prerequisites
- [Bun](https://bun.sh/) or Node.js installed.
- MongoDB connection string (Atlas or Local).

### Installation
1. **Clone the repository:**
```bash
   git clone <your-repo-link>
   cd buddy-script-core
```


2. **Install dependencies:**
```bash
bun install
```

3. **Environment Setup:**
Create a .env file in the root directory and add the following:
```text

NODE_ENV=development
PORT=5000
DATABASE_URL=your_mongodb_url
BCRYPT_SALT_ROUNDS=12
JWT_ACCESS_SECRET=your_access_token_secret
JWT_ACCESS_EXPIRES_IN=1d
JWT_REFRESH_SECRET =your-refresh-secret
JWT_REFRESH_EXPIRATION_TIME =30d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_URL=your_cloudinary_url
LOCAL_FRONTEND_URL = your front end you url

```


4. **Start the server:**
```bash
bun run dev
```


---

## 🧪 Test Accounts

For testing purposes, you can use the following credentials. All accounts share the same password.

| User | Email | Password |
| :--- | :--- | :--- |
| **User 1** | `saidul.rana@example.com` | `password123` |
| **User 2** | `hasan.rana@example.com` | `password123` |
| **User 3** | `ismail.rana@example.com` | `password123` |

---



## 🔍 API Query Guide

Our `QueryBuilder` allows you to handle complex queries directly via URL parameters:

- **Filtering:** `GET /api/v1/posts?visibility=PUBLIC`
- **Sorting:** `GET /api/v1/posts?sort=-createdAt` (Descending)
- **Pagination:** `GET /api/v1/posts?page=1&limit=10`
- **Searching:** `GET /api/v1/posts?searchTerm=javascript`
- **Field Limiting:** `GET /api/v1/posts?fields=title,content`

---

## 🛡️ Error Handling

The API provides standardized error responses for:

- **ZodError:** For request body/param validation.
- **CastError:** For invalid MongoDB ObjectIds.
- **DuplicateError:** For unique field violations.
- **AppError:** Custom operational errors with specific HTTP status codes.

---

## 👨‍💻 Author

**Saidul Rana** *Full Stack Developer*