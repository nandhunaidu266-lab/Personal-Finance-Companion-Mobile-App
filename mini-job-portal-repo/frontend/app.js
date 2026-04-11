const API_BASE = 'http://localhost:4000';

const jobForm = document.getElementById('jobForm');
const jobList = document.getElementById('jobList');
const statusText = document.getElementById('status');

async function fetchJobs() {
  statusText.textContent = 'Loading jobs...';
  const response = await fetch(`${API_BASE}/jobs`);
  const jobs = await response.json();

  jobList.innerHTML = '';
  jobs.forEach((job) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${job.title}</strong><br/>
      ${job.company} • ${job.location} • ${job.type}<br/>
      ${job.description}<br/>
      <button data-id="${job.id}">Delete</button>
    `;
    jobList.appendChild(li);
  });

  statusText.textContent = `${jobs.length} jobs loaded.`;
}

async function createJob(event) {
  event.preventDefault();
  const formData = new FormData(jobForm);

  const payload = {
    title: formData.get('title'),
    company: formData.get('company'),
    location: formData.get('location'),
    type: formData.get('type'),
    description: formData.get('description'),
  };

  const response = await fetch(`${API_BASE}/jobs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    statusText.textContent = 'Failed to create job.';
    return;
  }

  jobForm.reset();
  await fetchJobs();
}

async function handleDelete(event) {
  const button = event.target.closest('button[data-id]');
  if (!button) return;

  const response = await fetch(`${API_BASE}/jobs/${button.dataset.id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    statusText.textContent = 'Failed to delete job.';
    return;
  }

  await fetchJobs();
}

jobForm.addEventListener('submit', createJob);
jobList.addEventListener('click', handleDelete);

fetchJobs();
