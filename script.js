const menuButton = document.querySelector('.menu-button');
const mobileNav = document.getElementById('mobile-nav');
menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  mobileNav.hidden = open;
});
mobileNav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => { mobileNav.hidden = true; menuButton.setAttribute('aria-expanded', 'false'); }));
const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
  entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } });
}, { threshold: 0.08 }) : null;
document.querySelectorAll('.reveal').forEach(el => observer ? observer.observe(el) : el.classList.add('visible'));
const details = {
  interview: {
    title: 'AI Interview Platform',
    description: 'A full-stack platform for realistic, role-specific mock interviews grounded in a candidate’s résumé and the target job description.',
    highlights: [
      'Generates interview questions and personalized follow-ups based on résumé and job-description context.',
      'Uses retrieval-augmented generation (RAG) with pgvector to retrieve relevant embedded document chunks.',
      'Coordinates an event-driven interview engine with Kafka, allowing answer scoring to run asynchronously without blocking the conversation.'
    ],
    tech: ['React', 'Node.js', 'Express', 'PostgreSQL', 'pgvector', 'Kafka', 'Docker', 'AWS EC2', 'Claude Code']
  },
  foodie: {
    title: 'Foodie',
    description: 'A full-stack recipe discovery and curation experience with real-time, horizontally scalable conversations.',
    highlights: [
      'Built recipe search and curation features using React, Express, and MongoDB.',
      'Designed real-time chat using WebSockets, Redis Pub/Sub, and PostgreSQL.',
      'Supported message persistence and cross-server delivery to make conversations work across multiple application instances.'
    ],
    tech: ['React', 'Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'Redis', 'WebSockets']
  }
};
const dialog = document.getElementById('project-dialog');
const closeButton = dialog.querySelector('.dialog-close');
document.querySelectorAll('[data-project]').forEach(button => button.addEventListener('click', () => {
  const detail = details[button.dataset.project];
  if (!detail) return;
  document.getElementById('dialog-title').textContent = detail.title;
  document.getElementById('dialog-description').textContent = detail.description;
  const bullets = document.getElementById('dialog-highlights'); bullets.replaceChildren();
  detail.highlights.forEach(line => { const li = document.createElement('li'); li.textContent = line; bullets.appendChild(li); });
  const tags = document.getElementById('dialog-tech'); tags.replaceChildren();
  detail.tech.forEach(name => { const span = document.createElement('span'); span.textContent = name; tags.appendChild(span); });
  dialog.showModal(); document.body.classList.add('dialog-open'); closeButton.focus();
}));
function closeDialog(){ dialog.close(); document.body.classList.remove('dialog-open'); }
closeButton.addEventListener('click', closeDialog);
dialog.addEventListener('click', event => { if(event.target === dialog) closeDialog(); });
dialog.addEventListener('close', () => document.body.classList.remove('dialog-open'));
// Skill tabs: click, arrow keys, Home and End; only one visible panel at a time.
const skillTabs = [...document.querySelectorAll('[data-skill-tab]')];
function selectSkill(name, focus=false) {
  skillTabs.forEach(tab => {
    const selected = tab.dataset.skillTab === name;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
    if (selected && focus) tab.focus();
  });
  document.querySelectorAll('[data-skill-panel]').forEach(panel => {
    panel.hidden = panel.dataset.skillPanel !== name;
  });
}
skillTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectSkill(tab.dataset.skillTab));
  tab.addEventListener('keydown', event => {
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % skillTabs.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + skillTabs.length) % skillTabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = skillTabs.length-1;
    else return;
    event.preventDefault(); selectSkill(skillTabs[next].dataset.skillTab, true);
  });
});
