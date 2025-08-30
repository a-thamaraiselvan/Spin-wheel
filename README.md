# Professor Fun Spin-Wheel Application 🎯

A comprehensive full-stack application for celebrating professors and staff through an interactive spin wheel experience with AI-generated personalized quotes.

## Features

### 🎓 Staff Registration
- Simple registration form for professors/teachers
- Capture name, department, and three favorite things
- Beautiful, responsive design with smooth animations

### 🎛️ Admin Dashboard
- Modern analytics dashboard with real-time statistics
- Staff management with spin tracking
- Responsive design for desktop, tablet, and mobile
- Professional sidebar navigation

### 🎪 Interactive Spin Wheel
- Physics-based manual drag-to-spin functionality
- 15 Bollywood actors as wheel segments
- Realistic spinning animations with Framer Motion
- Visual feedback and celebration effects

### 🤖 AI-Powered Quotes
- Integration with Gemini 2.0 Flash API
- Personalized celebratory quotes using staff data
- Contextual messages connecting favorite things with selected actors
- Professional, motivational tone

### 🎉 Hall Mode
- Full-screen presentation mode for live events
- Sequential staff processing
- Auto-save results and progression
- Perfect for staff appreciation ceremonies

### 📊 Analytics & Tracking
- Complete spin history for each staff member
- Real-time dashboard statistics
- Unlimited spins per staff member
- Detailed result storage in MySQL

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Lucide React** for icons
- **Canvas Confetti** for celebration effects
- **React Router** for navigation

### Backend
- **Node.js** with Express
- **MySQL** database with mysql2
- **CORS** for cross-origin requests
- **dotenv** for environment configuration

### AI Integration
- **Google Gemini 2.0 Flash** API for quote generation
- Context-aware prompt engineering
- Personalized output based on staff preferences

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Setup MySQL Database**
   - Create a MySQL database named `professor_spin`
   - Update `.env` file with your database credentials

3. **Start the Application**
   ```bash
   npm start
   ```
   This runs both the backend server (port 3001) and frontend (port 5173)

4. **Access the Application**
   - Registration: `http://localhost:5173`
   - Admin Dashboard: `http://localhost:5173/admin`
   - Demo Credentials: `admin` / `admin123`

## Database Schema

### Staff Table
- `id`: Primary key
- `name`: Staff member name
- `department`: Department/faculty
- `favorite_thing_1/2/3`: Three favorite things
- `created_at`: Registration timestamp

### Spin Results Table
- `id`: Primary key
- `staff_id`: Foreign key to staff table
- `actor_name`: Selected actor from wheel
- `ai_quote`: Generated celebratory quote
- `spun_at`: Spin timestamp

## AI Quote Generation

The application uses Google's Gemini 2.0 Flash model to generate personalized celebratory quotes. Each quote:

- Addresses the professor by name
- Incorporates their favorite things
- Connects to the selected Bollywood actor
- Maintains a celebratory, appreciative tone
- Includes appropriate emojis and formatting

## Production Deployment

1. **Environment Setup**
   - Configure production MySQL database
   - Set up secure admin credentials
   - Configure Gemini API key

2. **Build for Production**
   ```bash
   npm run build
   ```

3. **Deploy Backend**
   - Deploy Node.js server to your preferred hosting platform
   - Ensure MySQL database is accessible
   - Configure environment variables

4. **Deploy Frontend**
   - Build and deploy the React application
   - Update API endpoints for production

## Security Features

- Admin authentication with secure login
- Input validation and sanitization
- CORS configuration for API security
- Environment variable protection for sensitive data

## Mobile Responsiveness

- Fully responsive design across all screen sizes
- Touch-friendly spin wheel interactions
- Optimized mobile navigation
- Adaptive layouts for different viewports

---

Built with ❤️ for celebrating our amazing educators!