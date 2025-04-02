# AI Trip Planner

AI Trip Planner is a full-stack web application that helps users plan their trips efficiently. It leverages AI to generate personalized travel itineraries, including route maps, hotel suggestions, and daily activities based on user preferences such as budget, travel dates, and the number of travelers.

## Features

- **User Authentication**: Secure user registration, login, and account activation.
- **Password Management**: Forgot password and reset password functionality.
- **Trip Planning**: AI-powered trip generation with detailed itineraries.
- **Interactive Map**: Visualize routes and waypoints using Leaflet.
- **Responsive Design**: Optimized for both desktop and mobile devices.
- **Role-Based Access**: Free and premium plans for users.
- **Dockerized Deployment**: Easily deployable using Docker and Docker Compose.

## Flow Chart

Below is the flow chart depicting the application's architecture and workflow:

![AI Trip Planner Flow](AI%20Trip%20Planner%20-%20Flow%20v1.3.png)

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Docker](https://www.docker.com/)
- [MongoDB](https://www.mongodb.com/)

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/AI-Trip-Planner.git
   cd AI-Trip-Planner
   ```

2. Set up environment variables:

   Create .env files in both backendDir and frontendDir directories.
   Add the required variables (e.g., DATABASE_URL, JWT_SECRET, EMAIL_USER, EMAIL_PASS, GEMINI_API_KEY).

3. Build and run the application using Docker Compose:

   ```bash
   docker-compose up --build
   ```

4. Access the application:

   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Usage

- **Register**: Create an account and activate it via email.
- **Login**: Log in to access the trip planner.
- **Plan a Trip**: Enter trip details (origin, destination, dates, budget, etc.) and generate a personalized itinerary.
- **View Results**: Explore the generated itinerary, route map, and hotel suggestions.

## Technologies Used

### Frontend

- React
- Vite
- React Router
- Leaflet (for maps)
- Bootstrap (for styling)

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- JWT (for authentication)
- Nodemailer (for email notifications)

### AI Integration

- Google Generative AI (Gemini API)

### Deployment

- Docker
- Docker Compose

### Testing

- Frontend: Jest and React Testing Library
- Backend: Postman or similar API testing tools

## License

This project is licensed under the MIT License.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## Contact

For any inquiries or support, please contact your-email@example.com.
