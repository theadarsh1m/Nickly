# 🔗 Nickly — URL Shortener & Text Snippet Tool

Nickly is a full-featured **URL Shortener & Text Snippet** web application built with **Node.js, Express.js, MongoDB, and EJS**.  
Shorten long URLs, save & share text snippets, track analytics, and manage everything from a sleek dashboard — with user accounts, public/private visibility, and a powerful admin panel.

🚀 **Live Demo:** [https://nickly.onrender.com](https://nickly.onrender.com)  
_(⚠️ Free Render server — may take a few seconds to wake up.)_

---

## ✨ Features

### Core
- 🔗 **Shorten Long URLs** — Generate unique short links using **NanoID**
- 📝 **Text Snippets** — Save and share text content via short links (up to 10,000 characters)
- 🎯 **Custom Short IDs** — Choose your own short ID if available
- 📊 **Analytics Dashboard** — Track total clicks with detailed visit history and **Chart.js** graphs

### Users & Visibility
- 🔐 **User Authentication** — Sign up & log in with username or email (JWT + bcrypt)
- 👁️ **Public / Private Links** — Toggle visibility when logged in (default: public)
- 📂 **Personal Dashboard** — "Public Links" & "My Links" tabs to manage your content

### Admin Panel (`/admin`)
- 🛡️ **Dark-themed Admin Dashboard** — Stats cards, search, filters, and full control
- 🔍 **Search & Filter** — Find links by short ID, URL, or text content; filter by type (URL/Text)
- 🔽 **Sorting** — Newest, Oldest, Text First, URL First
- 🗑️ **Delete Links** — Remove any link from the database
- 👥 **User Management** — View all users, promote/demote admins, remove users (cascades to their links)

### UI & UX
- 🎨 **Responsive Design** — Bootstrap 5 + custom CSS with Font Awesome icons
- 📄 **Pagination** — 10 links per page with sort-aware navigation
- 📋 **Copy to Clipboard** — One-click copy for generated short links

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | Node.js, Express.js |
| **Frontend** | EJS, Bootstrap 5, Font Awesome |
| **Database** | MongoDB Atlas (Mongoose ODM) |
| **Auth** | JWT (`jsonwebtoken`), bcrypt (`bcryptjs`), httpOnly cookies |
| **Utilities** | NanoID, Chart.js, cookie-parser, dotenv |
| **Deployment** | Render |

---

## 📂 Project Structure

```
Nickly/
├── controllers/
│   ├── url.js           # URL & text snippet handlers
│   ├── user.js          # Auth handlers (signup, login, logout)
│   └── admin.js         # Admin panel handlers
├── middlewares/
│   └── auth.js          # JWT authentication middleware
├── models/
│   ├── url.js           # URL/Text schema (shortId, entryType, visibility, etc.)
│   └── user.js          # User schema (username, email, password, role)
├── routes/
│   ├── url.js           # /url routes
│   ├── user.js          # /user routes
│   ├── admin.js         # /admin routes (requireAdmin guard)
│   └── staticRouter.js  # Home page route
├── services/
│   └── auth.js          # JWT sign/verify helpers
├── views/
│   ├── home.ejs         # Main dashboard
│   ├── analytics.ejs    # Link analytics page
│   ├── text.ejs         # Text snippet display
│   ├── login.ejs        # Login page
│   ├── signup.ejs       # Signup page
│   └── admin.ejs        # Admin panel
├── connect.js           # MongoDB connection
├── index.js             # App entry point
├── .env                 # Environment variables
├── vercel.json          # Vercel deployment config
└── package.json
```

---

## ⚡ Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/theadarsh1m/Nickly.git
cd Nickly
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file in the project root:

```env
PORT=8001
MONGO_URI=your_mongodb_atlas_connection_string
BASE_URL=http://localhost:8001
JWT_SECRET=your_secret_key
```

> ⚠️ Replace `your_mongodb_atlas_connection_string` with your MongoDB Atlas URI.

### 4. Start the server
```bash
npm start
```

Now visit 👉 [http://localhost:8001](http://localhost:8001)

### 5. Set up an admin (optional)
To promote a user to admin, run this in your MongoDB shell or Compass:
```js
db.users.updateOne({ username: "your_username" }, { $set: { role: "admin" } })
```
Then log out and log back in to activate admin access.

---

## 📊 Screenshots

### Dashboard
![Dashboard](https://i.ibb.co/JRmrbJDW/dashboard.png)

### Analytics
![Analytics](https://i.ibb.co/mKL3Dk3/Analytics.png)

---

## 🗺️ API Routes

| Method | Route | Description |
|---|---|---|
| `GET` | `/` | Home page (dashboard) |
| `POST` | `/url` | Shorten a URL |
| `POST` | `/url/text` | Save a text snippet |
| `GET` | `/url/analytics/:shortId` | View analytics for a link |
| `GET` | `/:shortId` | Redirect to original URL / display text |
| `POST` | `/user/signup` | Register a new user |
| `POST` | `/user/login` | Log in |
| `GET` | `/user/logout` | Log out |
| `GET` | `/admin` | Admin panel (admin only) |
| `POST` | `/admin/delete-link/:id` | Delete a link (admin only) |
| `POST` | `/admin/delete-user/:id` | Delete a user + their links (admin only) |
| `POST` | `/admin/toggle-role/:id` | Promote/demote a user (admin only) |

---

## 👨‍💻 Author

**Adarsh Sachan**  
📌 [GitHub](https://github.com/theadarsh1m) | [LinkedIn](https://linkedin.com/in/adarshsachan01)

---

## ⭐ Contribute

Want to improve **Nickly**?
- Fork the repo
- Create a new branch (`feature-xyz`)
- Commit changes
- Open a Pull Request 🚀

---

## 📜 License
This project is licensed under the MIT License.
