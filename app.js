// Add these functions
function setupFeedbackSystem() {
  // Feedback buttons
  document.querySelectorAll('.feedback-btn').forEach(button => {
    button.addEventListener('click', async (e) => {
      const feedbackType = e.target.classList.contains('thumbs-up') ? 'positive' : 'negative';
      
      try {
        await fetch('/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: feedbackType,
            query: document.getElementById('search-bar').value,
            response: document.querySelector('.formatted-answer').innerText
          })
        });
        
        e.target.style.backgroundColor = feedbackType === 'positive' 
          ? 'rgba(76, 175, 80, 0.3)' 
          : 'rgba(244, 67, 54, 0.3)';
      } catch (error) {
        console.error('Error submitting feedback:', error);
      }
    });
  });

  // Copy notes
  document.querySelector('.copy-notes').addEventListener('click', () => {
    const notes = document.querySelector('.notes-input').value;
    navigator.clipboard.writeText(notes)
      .then(() => alert('Notes copied to clipboard!'))
      .catch(() => alert('Failed to copy notes'));
  });

  // Follow-up question
  document.getElementById('submit-followup').addEventListener('click', () => {
    const followupQuery = document.getElementById('followup-query').value;
    if (followupQuery.trim()) {
      document.getElementById('search-bar').value = followupQuery;
      document.getElementById('search-form').dispatchEvent(new Event('submit'));
    }
  });
}

// Call this in your fetch response handler
setupFeedbackSystem();
