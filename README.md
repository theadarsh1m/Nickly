# 🔗 Nickly - URL Shortener

Nickly is a **URL Shortener web application** built with **Node.js, Express.js, MongoDB, and EJS**.  
It allows users to shorten long URLs, track analytics, and manage their links with a clean and responsive dashboard.

🚀 Live Demo: [https://nickly.onrender.com](https://nickly.onrender.com)  
(⚠️ Since it's deployed on a free Render server, it might take a few seconds to wake up.)

---

## ✨ Features

- 🔗 **Shorten Long URLs** – Generate unique short links using **NanoID**.
- 🎯 **Custom Short URLs** – Users can choose their own short ID if available.
- 📊 **Analytics Dashboard** – Track total clicks and view **click trends** with **Chart.js**.
- ⏳ **Visit History** – Every click is logged with timestamp data.
- 🗂️ **Pagination Support** – Displays 10 URLs per page for better management also search feature. (under construction)
- 🎨 **Responsive UI** – Built with **Bootstrap 5** and custom styles.
- 🌍 **Deployed on Render** – Connected with **MongoDB Atlas** for cloud storage.

---

## 🛠️ Technologies Used

- **Backend:** Node.js, Express.js
- **Frontend:** EJS, Bootstrap, Font Awesome
- **Database:** MongoDB Atlas (Mongoose ODM)
- **Utilities:** NanoID, Chart.js
- **Deployment:** Render

---


## 📂 Project Structure

```
Nickly/
│── controllers/      # Route handlers (shorten, analytics, etc.)
│── models/           # MongoDB models
│── routes/           # App routes
│── views/            # EJS templates
│── public/           # Static assets (CSS, JS)
│── .env              # Environment variables
│── index.js          # Entry point
│── connect.js        # MongoDB connection
```

---

## ⚡ Setup Instructions

Follow these steps to run the project locally:

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
Create a `.env` file in the project root with the following:

```env
PORT=8001
MONGODB_URI=your_mongodb_atlas_connection_string
BASE_URL=http://localhost:8001
```

> ⚠️ Replace `your_mongodb_atlas_connection_string` with your MongoDB Atlas URI.

### 4. Start the server
```bash
npm start
```

Now visit 👉 [http://localhost:8001](http://localhost:8001)

---

## 📊 Screenshots

### Dashboard
![Dashboard](https://i.ibb.co/JRmrbJDW/dashboard.png)

### Analytics
![Analytics](https://i.ibb.co/mKL3Dk3/Analytics.png)

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

---


