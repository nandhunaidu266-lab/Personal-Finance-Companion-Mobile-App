import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 4000);
const allowedOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:5500';

let jobs = [
  {
    id: 'job-1',
    title: 'Backend Developer',
    company: 'Northstar Tech',
    location: 'New York, NY',
    type: 'Full-time',
    description: 'Build and maintain REST APIs for hiring workflows.',
  },
  {
    id: 'job-2',
    title: 'UI Engineer',
    company: 'PixelCraft',
    location: 'Remote',
    type: 'Contract',
    description: 'Create clean, accessible interfaces for recruiter dashboards.',
  },
];

app.use(cors({ origin: allowedOrigin }));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'mini-job-portal-backend' });
});

app.get('/jobs', (_req, res) => {
  res.json(jobs);
});

app.post('/jobs', (req, res) => {
  const { title, company, location, type, description } = req.body;

  if (!title || !company || !location || !type || !description) {
    return res.status(400).json({ message: 'All job fields are required.' });
  }

  const newJob = {
    id: `job-${Date.now()}`,
    title: String(title).trim(),
    company: String(company).trim(),
    location: String(location).trim(),
    type: String(type).trim(),
    description: String(description).trim(),
  };

  jobs = [newJob, ...jobs];
  return res.status(201).json(newJob);
});

app.delete('/jobs/:id', (req, res) => {
  const previousLength = jobs.length;
  jobs = jobs.filter((job) => job.id !== req.params.id);

  if (jobs.length === previousLength) {
    return res.status(404).json({ message: 'Job not found.' });
  }

  return res.status(204).send();
});

app.post('/applications', (req, res) => {
  const { jobId, name, email, note } = req.body;

  if (!jobId || !name || !email || !note) {
    return res.status(400).json({ message: 'Application fields are required.' });
  }

  const target = jobs.find((job) => job.id === jobId);

  if (!target) {
    return res.status(404).json({ message: 'Target job not found.' });
  }

  return res.status(201).json({
    message: `Application received for ${target.title}.`,
  });
});

app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
