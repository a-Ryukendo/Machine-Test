# MERN Stack Machine Test - Agent Management & List Distribution System

A complete MERN stack application for agent management and list distribution with the following features:

## 🚀 Features

### 1. **Admin User Authentication**
- Secure login system with JWT tokens
- Role-based access control (Admin only)
- Session persistence across page refreshes

### 2. **Agent Management**
- Create, read, update, and delete agents
- Agent details: Name, Email, Phone (with country code), Password
- Secure password hashing with bcrypt
- Admin-only access to agent management

### 3. **CSV/Excel Upload & Distribution**
- Upload CSV, XLS, and XLSX files
- Automatic validation of file format and data
- Equal distribution of tasks among 5 agents
- Real-time display of distributed lists
- Support for files with columns: firstname, phone, notes

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **multer** - File upload handling
- **csv-parser** - CSV file parsing
- **exceljs** - Excel file parsing

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Vite** - Build tool

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** or **yarn**
- **Git** (for cloning the repository)

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Machine_Test
```

**Note:** Replace `<repository-url>` with the actual repository URL when available.

### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp env.example .env

# Edit .env file with your configuration
# Update MONGO_URI and JWT_SECRET
```

### 3. Frontend Setup
```bash
cd ../frontend

# Install dependencies
npm install

# Create environment file
cp env.example .env

# Edit .env file with your configuration
# Update VITE_API_BASE_URL if needed
```

### 4. Environment Configuration

#### Backend (.env)
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/mern_machine_test
JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_secure
CORS_ORIGIN=http://localhost:5173
```

#### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## 🏃‍♂️ Running the Application

### 1. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# On Windows
mongod

# On macOS/Linux
sudo systemctl start mongod

# On macOS with Homebrew
brew services start mongodb-community
```

### 2. Start Backend Server
```bash
cd backend
npm run dev
```
The backend will start on `http://localhost:5000`

### 3. Start Frontend Development Server
```bash
cd frontend
npm run dev
```
The frontend will start on `http://localhost:5173`

### 4. Access the Application
Open your browser and navigate to `http://localhost:5173`

## 📁 Project Structure

```
Machine_Test/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── agentController.js
│   │   │   └── listController.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   └── errorHandler.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Agent.js
│   │   │   └── List.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── agentRoutes.js
│   │   │   └── listRoutes.js
│   │   └── app.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── auth.js
│   │   │   ├── agent.js
│   │   │   └── list.js
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   └── LoginForm.jsx
│   │   │   └── common/
│   │   │       └── PrivateRoute.jsx
│   │   ├── contexts/
│   │   │   └── AuthContext.js
│   │   ├── pages/
│   │   │   ├── AuthPage.jsx
│   │   │   ├── dashboard.jsx
│   │   │   ├── AgentsPage.jsx
│   │   │   └── UploadListPage.jsx
│   │   └── App.jsx
│   └── package.json
└── README.md
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Agents (Admin only)
- `GET /api/agents` - Get all agents
- `POST /api/agents` - Create new agent
- `GET /api/agents/:id` - Get agent by ID
- `PUT /api/agents/:id` - Update agent
- `DELETE /api/agents/:id` - Delete agent

### Lists (Admin only)
- `POST /api/lists/upload` - Upload and distribute CSV/Excel file
- `GET /api/lists` - Get distributed lists

## 📊 File Upload Requirements

### Supported Formats
- CSV (.csv)
- Excel (.xls, .xlsx)

### Required Columns
- `firstname` - Text
- `phone` - Number (with country code, e.g., +1234567890)
- `notes` - Text

### Distribution Logic
- Files are automatically distributed among 5 agents
- If total items are not divisible by 5, remaining items are distributed sequentially
- Each agent receives an equal number of items when possible

## 🎯 Usage Guide

### 1. Admin Registration & Login
1. Navigate to `http://localhost:5173/register` to create a new admin account
2. Or navigate to `http://localhost:5173/login` if you already have an account
3. Enter your credentials and you'll be redirected to the dashboard upon successful login

### 2. Dashboard Navigation
1. Use the top navigation bar to move between different sections
2. Quick action buttons are available on the dashboard for easy access
3. User information and logout option are displayed in the top-right corner

### 3. Agent Management
1. Click "Manage Agents" from the dashboard or navigation bar
2. Add new agents with required details (Name, Email, Phone, Password)
3. View, edit, or delete existing agents
4. Use the navigation buttons to move between pages

### 4. List Upload & Distribution
1. Click "Upload & Distribute Lists" from the dashboard or navigation bar
2. Select a CSV or Excel file with the required format
3. Upload the file to automatically distribute tasks among agents
4. View the distributed lists for each agent
5. Files are automatically distributed equally among 5 agents

### 5. Sample Data
A sample CSV file (`sample_data.csv`) is included in the project root for testing purposes.


## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check MONGO_URI in .env file
   - Verify database permissions
   - Try restarting MongoDB service

2. **JWT Token Issues**
   - Check JWT_SECRET in .env file
   - Ensure token is being sent in Authorization header
   - Clear browser localStorage if needed

3. **CORS Errors**
   - Verify CORS_ORIGIN in backend .env
   - Check frontend API_BASE_URL
   - Ensure both servers are running

4. **File Upload Issues**
   - Ensure file format is supported (CSV, XLS, XLSX)
   - Check file size limits (10MB max)
   - Verify required columns are present (firstname, phone, notes)
   - Use the sample_data.csv file for testing

5. **Port Already in Use**
   - Check if ports 5000 (backend) or 5173 (frontend) are already in use
   - Kill existing processes or change ports in .env files
