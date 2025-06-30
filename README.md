# Task Manager

A modern, full-stack task management application built with React frontend and FastAPI backend.

## Description

- 🔐 User Authentication - Register and login with JWT tokens
- ✅ Complete Task Management - Create, read, update, and delete tasks
- 📊 Progress Tracking - Visual progress indicators and statistics
- 🎯 Task Status System - Planned, In Progress, and Done states
- ✏️ Inline Editing - Edit tasks directly in the interface
- 📱 Responsive Design - Works on desktop and mobile
- 🔄 Real-time Updates - Changes sync immediately with the backend

## Tech Stack 

### Frontend 

- React - UI framework
- JavaScript (ES6+) - Programming language
- Axios - HTTP client for API calls
- CSS3 - Styling

### Backend 

- FastAPI - Python web framerwork
- SQLAlchemy - Database ORM
- PostgreSQL - Database
- JWT - Authentication
- Pydantic - Data validation

## Getting Started

## Getting Started 

### Prerequisites 

- Node.js (v14 or higher)
- Python (v3.8 or higher)
- PostgreSQL database


#### Frontend Setup 

```
# Clone the repository
git clone https://github.com/YOUR_USERNAME/task-manager-fullstack.git
cd task-manager-fullstack

# Install dependencies
npm install

# Start development server
npm start 
```
The frontend will be available at http://localhost:3000 

#### Frontend Setup 

```
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv .venv
source venv/bin/activate # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server
uvicorn app.main:app --reload 
```
The backend API will be available at http://localhost:8000

## API Endpoints

### Authentication 

- POST /users/ - register new user
- POST /login - User login

### Tasks 

- GET /tasks/ - Get all tasks for authenticated user
- POST /tasks/ - Create new task
- PUT /tasks/{id} - Update tasks
- DELETE /tasks/{id} - Delete task

### Feature Showcase 

## Task Creation 

- **Title & Description** - Full control over task content
- **Status Selection** - Choose initial status (Planned/ In Progress/ Done)
- **Form Validation** - Ensures data quality

## Authentication & Security 

- **JWT Tokens** - Secure authentication
- **Protected Routes** - Tasks are user-specific
- **Form Validation** - Client and server-side validation

## Future Enhancements 

- Task categories/tags 
- Due dates and reminders 
- Team collaboration features 
- Mobile app version 
- Dark mode theme 
- Task search and filtering
- Export functionality 

## Contributing 
1. Fork the repository
2. Create a feature branch (git checkout -b feature/amazing-feature)
3. Commit your changes (git commit -m 'Add amazing feature')
4. Push to the branch (git push origin feature/amazing-feature)
5. Open a Pull Request

## Authors
Nikita - Full-stack Developer 
- GitHub: https://github.com/wakizasher
- LinkedIn: https://www.linkedin.com/in/nikita-gavrilov1337/

## Inspiration: 
https://roadmap.sh/projects/todo-list-api
