# Mini Job Portal Application

A simple standalone job portal web app that you can push to a **separate GitHub repository**.

## Features

- Add job postings (title, company, location, type, description)
- Search and filter jobs
- Delete jobs
- Apply to jobs through a lightweight dialog form
- Local persistence with browser `localStorage`

## Run locally

Open `index.html` directly in a browser, or use a static server:

```bash
cd mini-job-portal
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

## Push to a separate GitHub repo

```bash
cd mini-job-portal
git init
git add .
git commit -m "feat: initialize mini job portal app"
git branch -M main
git remote add origin https://github.com/<your-username>/mini-job-portal.git
git push -u origin main
```

Replace `<your-username>` with your GitHub username.
