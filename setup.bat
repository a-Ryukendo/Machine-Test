@echo off
echo ========================================
echo MERN Stack Machine Test Setup
echo ========================================
echo.

echo Setting up backend...
cd backend
if not exist .env (
    echo Creating .env file from template...
    copy env.example .env
    echo Please edit backend/.env with your MongoDB URI and JWT secret
) else (
    echo .env file already exists
)
cd ..

echo.
echo Setting up frontend...
cd frontend
if not exist .env (
    echo Creating .env file from template...
    copy env.example .env
    echo Frontend .env file created
) else (
    echo .env file already exists
)
cd ..

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Edit backend/.env with your MongoDB URI and JWT secret
echo 2. Start MongoDB service
echo 3. Run 'npm run dev' in backend folder
echo 4. Run 'npm run dev' in frontend folder
echo 5. Open http://localhost:5173 in your browser
echo.
echo Sample data file created: sample_data.csv
echo Use this file to test the upload functionality
echo.
pause 