const API_URL = 'https://justice.ai-n.workers.dev/api/ai/truth';
const modalOverlay = document.getElementById('modal-overlay');
const closeModalBtn = document.getElementById('close-modal');
const queryInput = document.getElementById('queryInput');
const searchButton = document.getElementById('searchButton');
const resultContainer = document.getElementById('resultContainer');

// Modal Controls
function closeModal() {
  modalOverlay.classList.remove('active');
  document.body.style.overflow = 'auto';
}

function openModal(initialQuery = '') {
  modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
  queryInput.value = initialQuery;
  if (initialQuery) performTruthQuery();
  else queryInput.focus();
}

// Event Listeners
closeModalBtn.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});

searchButton.addEventListener('click', performTruthQuery);
queryInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') performTruthQuery();
});

document.querySelectorAll('[data-search]').forEach(el => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    openModal(el.dataset.search);
  });
});

// API Functions
async function performTruthQuery() {
  const query = queryInput.value.trim();
  resultContainer.innerHTML = '';

  if (!query) {
    resultContainer.innerHTML = '<p class="error">Enter a question to initiate search protocol</p>';
    return;
  }

  resultContainer.innerHTML = '<p class="search-status">⚡ Scanning truth matrix...</p>';

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });

    const data = await response.json();
    let resultHTML = '';
    
    if (data.answer) {
      // Use marked to convert markdown to HTML
      const answerHTML = marked.parse(data.answer);

      resultHTML = `
        <div class="truth-entry">
          ${answerHTML}
        </div>
      `;

      if (data.citations?.length) {
        resultHTML += `
          <div class="citation-block">
            <h3>Source Verification</h3>
            <ul class="styled-list">
              ${data.citations.map(cite => `
                <li>
                  <a href="${cite.url}" target="_blank" rel="noopener">
                    ${cite.title}
                  </a>
                </li>
              `).join('')}
            </ul>
          </div>
        `;
      }
    } else {
      resultHTML = '<p class="no-results">No definitive patterns found. Refine query parameters.</p>';
    }

    resultContainer.innerHTML = resultHTML;
  } catch (error) {
    resultContainer.innerHTML = `
      <div class="error-section">
        <h3>System Error</h3>
        <p>Query failed: ${error.message}</p>
      </div>
    `;
  }
}
// 1. On page load, check for ?q=... and run a query if found
window.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const q = params.get('q');
  if (q) {
    openModal(q); // This fills input, opens modal, and runs the query
  }
});

// 2. Intercept clicks on internal ?q=... links (including markdown links)
document.body.addEventListener('click', function(event) {
  const link = event.target.closest('a[href]');
  if (!link) return;

  // Only handle links to this site with ?q=...
  const url = new URL(link.href, window.location.origin);
  const isSamePage = url.origin === window.location.origin && url.pathname === window.location.pathname;
  const hasQuery = url.searchParams.has('q');
  if (isSamePage && hasQuery) {
    event.preventDefault();
    const query = url.searchParams.get('q');
    if (query) {
      history.replaceState(null, '', url.search);
      openModal(query); // This fills input, opens modal, and runs the query
    }
  }
});
