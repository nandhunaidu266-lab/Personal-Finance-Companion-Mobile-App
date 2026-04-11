const STORAGE_KEY = 'mini-job-portal.jobs';

const seedJobs = [
  {
    id: crypto.randomUUID(),
    title: 'Frontend Developer',
    company: 'Acme Labs',
    location: 'Remote',
    type: 'Full-time',
    description: 'Build accessible, responsive user interfaces using modern JavaScript.',
  },
  {
    id: crypto.randomUUID(),
    title: 'Data Analyst Intern',
    company: 'Bright Metrics',
    location: 'Austin, TX',
    type: 'Internship',
    description: 'Analyze hiring funnel data and create weekly dashboards.',
  },
];

const state = {
  jobs: loadJobs(),
  selectedJobId: null,
};

const elements = {
  jobForm: document.getElementById('jobForm'),
  jobList: document.getElementById('jobList'),
  searchInput: document.getElementById('searchInput'),
  typeFilter: document.getElementById('typeFilter'),
  statusText: document.getElementById('statusText'),
  applyDialog: document.getElementById('applyDialog'),
  applyForm: document.getElementById('applyForm'),
  applyTitle: document.getElementById('applyTitle'),
  cancelApply: document.getElementById('cancelApply'),
};

function loadJobs() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return seedJobs;
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : seedJobs;
  } catch {
    return seedJobs;
  }
}

function persistJobs() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.jobs));
}

function getFilters() {
  return {
    query: elements.searchInput.value.trim().toLowerCase(),
    type: elements.typeFilter.value,
  };
}

function getVisibleJobs() {
  const { query, type } = getFilters();

  return state.jobs.filter((job) => {
    const matchesQuery =
      !query ||
      job.title.toLowerCase().includes(query) ||
      job.company.toLowerCase().includes(query);

    const matchesType = type === 'All' || job.type === type;
    return matchesQuery && matchesType;
  });
}

function renderJobs() {
  const jobs = getVisibleJobs();
  elements.jobList.innerHTML = '';

  if (!jobs.length) {
    elements.statusText.textContent = 'No jobs found for the current filters.';
    return;
  }

  elements.statusText.textContent = `${jobs.length} job${jobs.length === 1 ? '' : 's'} available`;

  jobs.forEach((job) => {
    const li = document.createElement('li');
    li.className = 'job-item';
    li.innerHTML = `
      <h3>${job.title}</h3>
      <p class="job-meta">${job.company} • ${job.location} • ${job.type}</p>
      <p>${job.description}</p>
      <div class="job-actions">
        <button data-action="apply" data-id="${job.id}">Apply</button>
        <button data-action="delete" data-id="${job.id}">Delete</button>
      </div>
    `;

    elements.jobList.appendChild(li);
  });
}

function resetForm(form) {
  form.reset();
}

function addJob(event) {
  event.preventDefault();
  const formData = new FormData(elements.jobForm);

  const job = {
    id: crypto.randomUUID(),
    title: String(formData.get('title')).trim(),
    company: String(formData.get('company')).trim(),
    location: String(formData.get('location')).trim(),
    type: String(formData.get('type')).trim(),
    description: String(formData.get('description')).trim(),
  };

  if (!job.title || !job.company || !job.location || !job.type || !job.description) {
    elements.statusText.textContent = 'Please fill every job field before submitting.';
    return;
  }

  state.jobs.unshift(job);
  persistJobs();
  renderJobs();
  resetForm(elements.jobForm);
}

function deleteJob(id) {
  state.jobs = state.jobs.filter((job) => job.id !== id);
  persistJobs();
  renderJobs();
}

function openApplyDialog(id) {
  const job = state.jobs.find((item) => item.id === id);
  if (!job) return;

  state.selectedJobId = id;
  elements.applyTitle.textContent = `${job.title} at ${job.company}`;
  elements.applyDialog.showModal();
}

function submitApplication(event) {
  event.preventDefault();

  const name = document.getElementById('applicantName').value.trim();
  const email = document.getElementById('applicantEmail').value.trim();
  const note = document.getElementById('applicantNote').value.trim();

  if (!name || !email || !note) {
    return;
  }

  const target = state.jobs.find((job) => job.id === state.selectedJobId);
  elements.applyDialog.close();
  resetForm(elements.applyForm);
  alert(`Application submitted for ${target?.title ?? 'the selected role'}. Good luck, ${name}!`);
}

function handleJobListClick(event) {
  const button = event.target.closest('button[data-action]');
  if (!button) return;

  const { action, id } = button.dataset;

  if (action === 'delete') {
    deleteJob(id);
    return;
  }

  if (action === 'apply') {
    openApplyDialog(id);
  }
}

function init() {
  elements.jobForm.addEventListener('submit', addJob);
  elements.searchInput.addEventListener('input', renderJobs);
  elements.typeFilter.addEventListener('change', renderJobs);
  elements.jobList.addEventListener('click', handleJobListClick);
  elements.applyForm.addEventListener('submit', submitApplication);
  elements.cancelApply.addEventListener('click', () => elements.applyDialog.close());

  renderJobs();
}

init();
