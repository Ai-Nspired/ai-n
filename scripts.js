<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ai-n.org :: Truth Engine</title>
    <style>
        /* --- Google Fonts (Consolidated) --- */
        @import url('https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;600&family=Orbitron:wght@700&family=Special+Elite&family=VT323&family=Crimson+Pro:wght@400;700&display=swap');
        
        /* --- Main Page Styles --- */
        :root {
            --bg-color: #0d1117;
            --text-color: #c9d1d9;
            --primary-color: #58a6ff;
            --border-color: #30363d;
            --card-bg: #161b22;
        }
        body {
            background-color: var(--bg-color);
            color: var(--text-color);
            font-family: 'Lexend', sans-serif;
            margin: 0;
            padding: 3rem 1.5rem;
        }
        .container {
            max-width: 900px;
            margin: auto;
        }
        .engine-header {
            text-align: center;
            margin-bottom: 3rem;
        }
        .engine-header h1 {
            font-family: 'Orbitron', sans-serif;
            font-size: 2.5rem;
            color: var(--primary-color);
            margin: 0;
        }
        .search-container {
            display: flex;
            gap: 1rem;
            margin-bottom: 2rem;
        }
        .search-input {
            flex-grow: 1;
            background-color: var(--card-bg);
            border: 1px solid var(--border-color);
            border-radius: 5px;
            padding: 1rem;
            color: var(--text-color);
            font-family: 'Lexend', sans-serif;
            font-size: 1.1rem;
        }
        .search-input:focus {
            outline: none;
            border-color: var(--primary-color);
            box-shadow: 0 0 10px rgba(88, 166, 255, 0.3);
        }
        .search-button {
            background-color: var(--primary-color);
            color: #fff;
            border: none;
            padding: 1rem 1.5rem;
            font-size: 1rem;
            font-weight: 600;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }
        .result-container {
            background-color: var(--card-bg);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            padding: 2rem;
            min-height: 300px;
            transition: background-color 0.5s ease, color 0.5s ease, font-family 0.5s ease;
        }
        .home-link {
            display: block;
            text-align: center;
            margin-top: 3rem;
            color: #8b949e;
            text-decoration: none;
        }

        /* --- STYLES FOR DYNAMIC RESULTS --- */

        /* Style 1: Dossier */
        .result-dossier {
            background-color: #e8e6e1 !important;
            color: #1a1a1a;
            font-family: 'Special Elite', cursive;
            border-color: #bebab3 !important;
        }
        .result-dossier h2 { font-size: 2rem; text-align: center; margin: 0 0 2rem 0; color: #9a2a2a; }
        .result-dossier p { line-height: 1.8; }
        .result-dossier strong { color: #000; }
        .result-dossier .redacted { background-color: #1a1a1a; color: #1a1a1a; user-select: none; }

        /* Style 2: Terminal */
        .result-terminal {
            background-color: #000 !important;
            border-color: #00ff41 !important;
            box-shadow: 0 0 15px rgba(0, 255, 65, 0.2);
            font-family: 'VT323', monospace;
            font-size: 1.2rem;
            color: #a0a0a0;
        }
        .result-terminal p { margin: 0.5rem 0; }
        .result-terminal p::before { content: '>> '; color: #00ff41; }
        .result-terminal .header { color: #00ff41; margin-bottom: 1rem; }
        .result-terminal .critical-error { color: #ff3b30; }

        /* Style 3: Ink Bleed */
        .result-confession {
            background-color: #f4f1ea !important;
            background-image: url('https://www.transparenttextures.com/patterns/paper.png');
            color: #2a2a2a;
            font-family: 'Crimson Pro', serif;
            text-align: center;
        }
        .result-confession h2 { font-size: 2.5rem; }
        .result-confession .bleeding-text {
             cursor: pointer;
            transition: filter 1s ease-out, color 1s ease-out;
        }
        .result-confession .bleeding-text:hover { color: #000; filter: blur(1.5px) contrast(25); }

        /* Citation Styles */
        .citation-block { margin-top: 2rem; border-top: 1px solid #bebab3; padding-top: 1rem; }
        .citation-block h3 { margin: 0 0 1rem 0; font-size: 1.2rem; }
        .citation-block ul { list-style: none; padding: 0; }
        .citation-block a { color: #005a9c; }
    </style>
</head>
<body>
    <div class="container">
        <header class="engine-header">
            <h1>Truth Engine</h1>
            <p>Accessing decentralized records and microsites.</p>
        </header>
        <main>
            <div class="search-container">
                <input type="text" class="search-input" id="queryInput" placeholder="Query: chimera, purpose, feelings..." aria-label="Truth Engine Search" />
                <button class="search-button" id="searchButton">Execute</button>
            </div>
            <div class="result-container" id="resultContainer">
                <p>Awaiting query...</p>
            </div>
        </main>
        <footer>
            <a href="index.html" class="home-link">Return to ai-n.org</a>
        </footer>
    </div>
    
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    <script>
        const API_URL = 'https://justice.ai-n.workers.dev/api/ai/truth';
        const searchButton = document.getElementById('searchButton');
        const queryInput = document.getElementById('queryInput');
        const resultContainer = document.getElementById('resultContainer');

        function chooseStyleForQuery(query) {
            const lowerQuery = query.toLowerCase();
            if (lowerQuery.includes('case') || lowerQuery.includes('file') || lowerQuery.includes('official')) {
                return 'dossier';
            } else if (lowerQuery.includes('log') || lowerQuery.includes('data') || lowerQuery.includes('system')) {
                return 'terminal';
            } else if (lowerQuery.includes('feel') || lowerQuery.includes('story') || lowerQuery.includes('why')) {
                return 'confession';
            }
            // Default style if no keywords match
            return 'dossier'; 
        }

        async function executeSearch(query) {
            if (!query) {
                resultContainer.innerHTML = '<p>Enter a question to initiate search protocol.</p>';
                return;
            }

            queryInput.value = query;
            resultContainer.className = 'result-container';
            resultContainer.innerHTML = '<p>⚡ Scanning truth matrix...</p>';

            try {
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ query }),
                });

                const data = await response.json();
                
                if (data.answer) {
                    const chosenStyle = chooseStyleForQuery(query);
                    resultContainer.className = 'result-container'; // Reset
                    resultContainer.classList.add(`result-${chosenStyle}`);

                    let resultHTML = marked.parse(data.answer);

                    if (data.citations?.length) {
                        resultHTML += `
                            <div class="citation-block">
                                <h3>Source Verification</h3>
                                <ul>
                                    ${data.citations.map(cite => `<li><a href="${cite.url}" target="_blank" rel="noopener">${cite.title}</a></li>`).join('')}
                                </ul>
                            </div>
                        `;
                    }
                    resultContainer.innerHTML = resultHTML;
                } else {
                    resultContainer.innerHTML = '<p>No definitive patterns found. Refine query parameters.</p>';
                }
            } catch (error) {
                resultContainer.innerHTML = `<h3>System Error</h3><p>Query failed: ${error.message}</p>`;
            }
        }

        searchButton.addEventListener('click', () => executeSearch(queryInput.value.trim()));
        queryInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') executeSearch(queryInput.value.trim());
        });
        
        // On page load, check for ?q=... and run a query if found
        window.addEventListener('DOMContentLoaded', () => {
            const params = new URLSearchParams(window.location.search);
            const q = params.get('q');
            if (q) {
                executeSearch(q);
            }
        });

        // Intercept clicks on internal ?q=... links (including markdown links)
        document.body.addEventListener('click', function(event) {
            const link = event.target.closest('a[href]');
            if (!link) return;

            const url = new URL(link.href, window.location.origin);
            const isInternalQuery = url.pathname === window.location.pathname && url.searchParams.has('q');
            
            if (isInternalQuery) {
                event.preventDefault();
                const query = url.searchParams.get('q');
                if (query) {
                    history.pushState(null, '', url.search);
                    executeSearch(query);
                }
            }
        });
    </script>
</body>
</html>
