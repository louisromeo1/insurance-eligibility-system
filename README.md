# Insurance Eligibility Verification System

This project is a full-stack application to verify patient insurance eligibility. The backend provides a REST API to check eligibility and retrieve history, using a mock insurance service and PostgreSQL for storage. The optional frontend offers a user-friendly interface to interact with the API.

## Project Structure
insurance-eligibility-system/
├── src/
│   ├── controllers/eligibilityController.ts  # API routes for eligibility checks
│   ├── models/Patient.ts                    # TypeORM entity for patients table
│   ├── models/EligibilityCheck.ts           # TypeORM entity for eligibility_checks table
│   ├── services/mockInsuranceService.ts     # Mock insurance API logic
│   ├── db/data-source.ts                    # TypeORM database connection
│   ├── types.ts                             # TypeScript interfaces
│   └── index.ts                             # Main Express server
├── scripts/
│   └── create-tables.sql                    # SQL to create database tables
├── frontend/                                # Optional React frontend
│   ├── src/App.tsx                          # Main React component
│   ├── src/App.css                          # Styles for frontend
│   └── ...                                  # Other React files
├── .env                                     # Environment variables
├── package.json                             # Backend dependencies and scripts
└── tsconfig.json                            # TypeScript configuration
text### File Descriptions
- **Backend**:
  - `src/index.ts`: Initializes Express server, sets up CORS, and mounts routes. Starts on port 3000.
  - `src/controllers/eligibilityController.ts`: Defines API endpoints:
    - `POST /eligibility/check`: Validates input, saves patient/check, returns eligibility response.
    - `GET /eligibility/history/:patientId`: Retrieves eligibility history for a patient.
  - `src/models/Patient.ts`: TypeORM entity for `patients` table (ID, name, DOB).
  - `src/models/EligibilityCheck.ts`: TypeORM entity for `eligibility_checks` table (status, coverage, errors).
  - `src/services/mockInsuranceService.ts`: Mocks insurance API. Returns:
    - `Active` with coverage for even `memberNumber` (last digit).
    - `Inactive` with no coverage for odd `memberNumber`.
    - `Unknown` with error (`"API connection failed"`) if `memberNumber` ends with `0`.
  - `src/db/data-source.ts`: Configures TypeORM connection to PostgreSQL via `DATABASE_URL`.
  - `src/types.ts`: Defines `EligibilityRequest` and `EligibilityResponse` interfaces.
  - `scripts/create-tables.sql`: Creates `patients` and `eligibility_checks` tables with foreign key and indexes.
  - `.env`: Stores `DATABASE_URL` and `PORT` (default 3000).
  - `package.json`: Includes dependencies (`express`, `typeorm`, `pg`, `cors`, etc.) and scripts (`npm run start`).

- **Frontend**:
  - `frontend/src/App.tsx`: React component with form for eligibility checks, result display, and history table.
  - `frontend/src/App.css`: Modern styles (Roboto font, blue theme, responsive grid).
  - `frontend/`: Contains React setup (`package.json`, etc.) for UI on port 3001.

## Prerequisites
- **Node.js**: v16 or higher.
- **PostgreSQL**: v12 or higher, running locally (port 5432).
- **Git Bash**: For `curl` commands (Windows).

## Setup Instructions

1. **Clone Repository**:
   ```bash
   git clone <repository-url>
   cd insurance-eligibility-system

Install Backend Dependencies:
bashnpm install

Set Up Environment:

Create .env file in root:
textDATABASE_URL=postgres://postgres:yourpassword@localhost:5432/eligibility_db
PORT=3000

Replace yourpassword with your PostgreSQL password.


Set Up Database:

Create database:
bashpsql -U postgres -c "CREATE DATABASE eligibility_db;"

Create tables:
bashpsql -U postgres -d eligibility_db -f scripts/create-tables.sql



Run Backend:
bashnpm run start

Confirms: Server running on port 3000, Database connected.


Set Up and Run Frontend (Optional):
bashcd frontend
npm install
npm start

Opens http://localhost:3001 in browser.



Usage
Backend API

POST /eligibility/check:

Submits eligibility check.
Example:
bashcurl -X POST http://localhost:3000/eligibility/check -H "Content-Type: application/json" -d '{"patientId":"P123456","patientName":"John Doe","dateOfBirth":"1980-05-15","memberNumber":"INS789012","insuranceCompany":"BlueCross BlueShield","serviceDate":"2024-02-15"}'

Response (Active, even memberNumber):
json{
  "eligibilityId": "ELG-<timestamp>",
  "patientId": "P123456",
  "checkDateTime": "<ISO timestamp>",
  "status": "Active",
  "coverage": { "deductible": 1500, ... },
  "errors": []
}



GET /eligibility/history/:patientId:

Retrieves check history.
Example:
bashcurl http://localhost:3000/eligibility/history/P123456

Response: Array of checks.


Unknown Case:

Use memberNumber ending in 0 (e.g., INS1230):
bashcurl -X POST http://localhost:3000/eligibility/check -H "Content-Type: application/json" -d '{"patientId":"P345678","patientName":"Alice Brown","dateOfBirth":"1975-07-10","memberNumber":"INS1230","insuranceCompany":"Cigna","serviceDate":"2024-02-20"}'

Response:
json{
  "eligibilityId": "ELG-<timestamp>",
  "patientId": "P345678",
  "checkDateTime": "<ISO timestamp>",
  "status": "Unknown",
  "coverage": {},
  "errors": ["API connection failed"]
}




Frontend

Open http://localhost:3001.
Check Eligibility: Fill form (e.g., Patient ID: P123456, Member ID: INS789012) and submit.
View History: Enter Patient ID (e.g., P123456) and click "Fetch History".
Unknown Case: Use Member ID ending in 0 (e.g., INS1230) to see "Unknown" status with error.

Testing

Verify Database Schema:
bashpsql -U postgres -d eligibility_db -c "\dt"

Expected: Lists patients, eligibility_checks.


Test Database Connection:
bashpsql -U postgres -d eligibility_db -c "SELECT 1;"

Expected: Returns 1.


Verify Data Storage:

After POST, check:
bashpsql -U postgres -d eligibility_db -c "SELECT * FROM patients;"
psql -U postgres -d eligibility_db -c "SELECT * FROM eligibility_checks;"



Test Unknown Case:

See curl command above for INS1230. Verify database:
bashpsql -U postgres -d eligibility_db -c "SELECT * FROM eligibility_checks WHERE patient_id = 'P345678';"




Notes

Mock Logic: memberNumber ending in 0 triggers Unknown status with error. Even numbers (last digit) return Active, odd return Inactive.
CORS: Configured for http://localhost:3001 in src/index.ts.
Frontend Styling: Uses Roboto font, blue theme, responsive design.
