# 🗺️ AI Trip Planner

AI Trip Planner is a full-stack web application designed to simplify your travel planning. Leveraging the power of AI, it generates personalized itineraries, including route maps, hotel suggestions, and daily activities, tailored to your preferences like budget, travel dates, and the number of travelers.

## ✨ Features

- **🔐 User Authentication:** Securely register, log in, and activate your account.
- **🔑 Password Management:** Easily recover or reset your password.
- **🤖 AI-Powered Trip Planning:** Generate detailed itineraries with AI assistance.
- **📍 Interactive Map:** Visualize your routes and waypoints using Leaflet.
- **📱 Responsive Design:** Enjoy a seamless experience on both desktop and mobile devices.
- **💰 Role-Based Access:** Choose between free and premium plans to suit your needs.
- **🐳 Dockerized Deployment:** Deploy effortlessly with Docker and Docker Compose.

## 🧭 Application Flow

Here's a visual representation of the application's architecture and workflow:

![AI Trip Planner Flow](AI%20Trip%20Planner%20-%20Flow%20v1.3.png)

## 🚀 Installation

### ⚙️ Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Docker](https://www.docker.com/)
- [MongoDB](https://www.mongodb.com/)

### 🛠️ Installation Steps

1.  **Clone the repository:**

    ```bash
    git clone [https://github.com/your-username/AI-Trip-Planner.git](https://github.com/your-username/AI-Trip-Planner.git)
    cd AI-Trip-Planner
    ```

2.  **Configure environment variables:**

    - Create `.env` files in both the `backendDir` and `frontendDir` directories.
    - Populate these files with the necessary variables (e.g., `DATABASE_URL`, `JWT_SECRET`, `EMAIL_USER`, `EMAIL_PASS`, `GEMINI_API_KEY`).

3.  **Build and run with Docker Compose:**

    ```bash
    docker-compose up --build
    ```

4.  **Access the application:**

    - Frontend: [https://tsk-ai-trip-planner.vercel.app/](https://tsk-ai-trip-planner.vercel.app/)
    - Backend API: [https://ai-trip-planner-ymrv.onrender.com/](https://ai-trip-planner-ymrv.onrender.com/)

## 🧑‍🎨 Usage Guide

1.  **Register:** Create a new account and activate it via the email you receive.
2.  **Login:** Access the trip planner by logging in with your credentials.
3.  **Plan Your Trip:** Input your trip details (origin, destination, dates, budget, etc.) to generate a personalized itinerary.
4.  **Explore Results:** Review the generated itinerary, route map, and hotel suggestions.

## 🛠️ Technologies Stack

### 💻 Frontend

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [React Router](https://reactrouter.com/)
- [Leaflet](https://leafletjs.com/) (for maps)
- [Bootstrap](https://getbootstrap.com/) (for styling)

### ⚙️ Backend

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [JWT](https://jwt.io/) (for authentication)
- [Nodemailer](https://nodemailer.com/) (for email notifications)

### 🧠 AI Integration

- [Google Generative AI (Gemini API)](https://ai.google.dev/)

### 📦 Deployment

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

### ✅ Testing

- Frontend: [Jest](https://jestjs.io/) and [React Testing Library](https://testing-library.com/docs/)
- Backend: [Postman](https://www.postman.com/) or similar API testing tools

## 📄 License

This project is licensed under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are highly encouraged! Please feel free to fork the repository and submit a pull request with your improvements.

## 📧 Contact

For any inquiries or support, please reach out to tskbalaji15@gmail.com.
