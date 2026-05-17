# TalentMatch — Candidate Shortlisting System

A full-stack Candidate Shortlisting System that filters and ranks candidates based on required skill sets, with AI-powered matching via OpenRouter.

---

## Tech Stack

| Layer    | Technology                        |
|----------|-----------------------------------|
| Frontend | React 18, React Router, Recharts  |
| Backend  | Node.js, Express.js               |
| Database | MongoDB + Mongoose                |
| AI API   | OpenRouter (any LLM model)        |

---

## Project Structure

```
candidate-shortlisting/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── candidateController.js # CRUD for candidates
│   │   ├── matchController.js     # Basic skill-matching logic
│   │   └── aiController.js        # OpenRouter AI shortlisting
│   ├── models/
│   │   └── Candidate.js           # Mongoose schema
│   ├── routes/
│   │   ├── candidates.js
│   │   ├── match.js
│   │   └── ai.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.js / .css
    │   │   ├── CandidateCard.js / .css
    │   │   ├── AIResultCard.js / .css
    │   │   ├── SkillTag.js / .css
    │   │   └── MatchScoreChart.js
    │   ├── pages/
    │   │   ├── Dashboard.js / .css
    │   │   ├── AddCandidate.js / .css
    │   │   ├── CandidateList.js / .css
    │   │   └── Shortlist.js / .css
    │   ├── services/
    │   │   └── api.js             # Axios API calls
    │   ├── styles/
    │   │   └── global.css
    │   ├── App.js
    │   └── index.js
    ├── .env.example
    └── package.json
```

---

## Prerequisites

- **Node.js** v18+
- **npm** v9+
- **MongoDB** (local install or MongoDB Atlas)
- **OpenRouter API Key** — get one at https://openrouter.ai (free tier available)

---

## Setup Instructions

### 1. Clone / unzip the project

```bash
unzip candidate-shortlisting.zip
cd candidate-shortlisting
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Copy and fill in the environment variables:

```bash
cp .env.example .env
```

Edit `.env`:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/candidate_shortlisting
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxx
OPENROUTER_MODEL=openai/gpt-4o
```

> **Getting your OpenRouter API key:**
> 1. Go to https://openrouter.ai
> 2. Sign up / log in
> 3. Navigate to "Keys" → Create a new key
> 4. Paste it into `.env`

Start the backend:

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The server will run at **http://localhost:5000**

---

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Copy environment variables:

```bash
cp .env.example .env
```

Edit `.env` (only needed if your backend runs on a different port/host):

```
REACT_APP_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm start
```

The app will open at **http://localhost:3000**

---

## API Endpoints

### Candidates

| Method | Endpoint              | Description             |
|--------|-----------------------|-------------------------|
| POST   | `/api/candidates`     | Add a new candidate     |
| GET    | `/api/candidates`     | Get all candidates      |
| DELETE | `/api/candidates/:id` | Delete a candidate      |

**GET** supports query params: `?search=name&skill=React`

**POST body example:**
```json
{
  "name": "Rahul Sharma",
  "email": "rahul@gmail.com",
  "skills": ["React", "Node.js", "MongoDB"],
  "experience": 2,
  "bio": "Full-stack developer with e-commerce experience"
}
```

### Matching

| Method | Endpoint          | Description                  |
|--------|-------------------|------------------------------|
| POST   | `/api/match`      | Basic skill-match shortlist  |
| POST   | `/api/ai/shortlist` | AI-powered shortlist via OpenRouter |

**POST `/api/match` body:**
```json
{
  "requiredSkills": ["React", "Node.js"],
  "minExperience": 1,
  "preferredSkills": ["MongoDB", "AWS"]
}
```

---

## Features

- ✅ Add, view, search, and delete candidate profiles
- ✅ Skill-based filtering and search
- ✅ Basic matching with skill overlap scoring and tier ranking (High / Medium / Low)
- ✅ Preferred skills bonus scoring
- ✅ Bar chart visualization of match scores (top 10 candidates)
- ✅ AI-powered ranking via OpenRouter with explanations, strengths, and gaps
- ✅ Responsive design

---

## Troubleshooting

**MongoDB connection error:**
- Make sure MongoDB is running locally: `mongod` or `brew services start mongodb-community`
- Or update `MONGODB_URI` in `.env` with your Atlas connection string

**AI shortlist returns 502 error:**
- Verify your `OPENROUTER_API_KEY` is correct and has credits
- Check that the model name in `OPENROUTER_MODEL` is valid (see https://openrouter.ai/models)

**CORS errors:**
- The backend has CORS enabled for all origins by default. If deploying to production, restrict origins in `server.js`.
