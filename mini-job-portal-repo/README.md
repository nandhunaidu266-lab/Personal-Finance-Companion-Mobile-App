# Mini Job Portal - New Environment + Repository Template

This is a **second, separate repository template** for a Mini Job Portal with:

- `frontend/` (vanilla HTML/CSS/JS)
- `backend/` (Node.js + Express API)
- `docker-compose.yml` for quick local environment setup

## 1) Run locally without Docker

### Backend
```bash
cd backend
npm install
cp .env.example .env
npm start
```

### Frontend
Serve `frontend/` with any static server (example):
```bash
cd frontend
python3 -m http.server 5500
```

Open `http://localhost:5500`.

## 2) Run with Docker

From this folder:
```bash
docker compose up
```

## 3) Publish as a separate GitHub repository

```bash
cd mini-job-portal-repo
git init
git add .
git commit -m "feat: create api-based mini job portal environment"
git branch -M main
git remote add origin https://github.com/<your-username>/mini-job-portal-repo.git
git push -u origin main
```

## GitHub link format

After creating the repository, your project link will look like:

- `https://github.com/<your-username>/mini-job-portal-repo`
