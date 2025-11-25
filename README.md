Reddit Clone Project – Full Setup Guide
# Reddit Clone Project

This is a Reddit clone project using:

- **Backend:** Node.js + Express + TypeScript + MongoDB + ES Modules
- **Frontend:** Next.js + TypeScript + Tailwind CSS
- **Database:** MongoDB (local or Atlas)

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <YOUR_REPO_URL>
cd reddit-clone

2. Install Backend Dependencies
cd backend
npm ci


Ensures exact same versions of all dependencies.

If package-lock.json is missing, use npm install instead.

3. Install Frontend Dependencies
cd ../frontend
npm ci

4. Configure Environment Variables (Optional)

Create .env in backend/ if needed (MongoDB URI, PORT, etc.):

MONGO_URI=mongodb://localhost:27017/reddit_clone
PORT=5000

5. Run the Project
Backend
cd backend
npm run dev


Server runs at http://localhost:5000

Uses ts-node-dev with ES Modules for hot reload

Frontend
cd frontend
npm run dev

Next.js app runs at http://localhost:3000

