document.addEventListener('DOMContentLoaded', () => {
    let currentLanguage = 'english';
    let currentStep = -1; // -1 is language selection, 0 to N are questions, N+1 is review
    let caseAnswers = {};
    const activeCaseId = localStorage.getItem('mediease_active_case');

    if (!activeCaseId) {
        alert("No active case found. Redirecting to dashboard.");
        window.location.href = 'patient-dashboard.html';
        return;
    }

    const languageScreen = document.getElementById('language-selection');
    const questionScreen = document.getElementById('question-screen');
    const reviewScreen = document.getElementById('review-screen');
    const questionContainer = document.getElementById('question-container');
    
    const btnNext = document.getElementById('btn-next');
    const btnPrev = document.getElementById('btn-prev');
    const btnSubmit = document.getElementById('btn-submit');
    const questionProgress = document.getElementById('question-progress');
    const reviewContent = document.getElementById('review-content');

    // Language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            currentLanguage = e.target.dataset.lang;
            currentStep = 0;
            updateUI();
        });
    });

    btnNext.addEventListener('click', async () => {
        const saved = saveCurrentAnswerLocally();
        
        // Auto save to backend
        if (currentStep >= 0 && currentStep < caseQuestions.length && saved) {
            btnNext.disabled = true;
            const q = caseQuestions[currentStep];
            const ansStr = typeof caseAnswers[q.id] === 'object' ? 
                           `Answer: ${caseAnswers[q.id].answer} | Details: ${caseAnswers[q.id].details.join(', ')}` : 
                           caseAnswers[q.id];
            
            await apiFetch(`/api/patient/cases/${activeCaseId}/autosave`, {
                method: 'POST',
                body: JSON.stringify({
                    section_name: q.id,
                    answer_text: ansStr || ''
                })
            });
            btnNext.disabled = false;
        }

        if (currentStep < caseQuestions.length - 1) {
            currentStep++;
            updateUI();
        } else {
            currentStep++; // Go to review
            updateUI();
        }
    });

    btnPrev.addEventListener('click', () => {
        if (currentStep > 0) {
            currentStep--;
            updateUI();
        } else {
            currentStep = -1; // Back to language
            updateUI();
        }
    });

    btnSubmit.addEventListener('click', async () => {
        const auth = getAuth();
        if (!auth || !auth.patient_id) {
            alert("You must be logged in to submit a case.");
            return;
        }

        btnSubmit.textContent = "Submitting...";
        btnSubmit.disabled = true;

        const res = await apiFetch(`/api/patient/cases/${activeCaseId}/submit`, {
            method: 'POST'
        });

        if (!res.ok) {
            alert("Error submitting case: " + res.error);
            btnSubmit.textContent = translations[currentLanguage].btn_submit;
            btnSubmit.disabled = false;
            return;
        }

        // Clear active case
        localStorage.removeItem('mediease_active_case');
        
        alert("Case Submitted Successfully! Case ID: " + activeCaseId);
        window.location.href = 'patient-dashboard.html';
    });

    function saveCurrentAnswerLocally() {
        if (currentStep >= 0 && currentStep < caseQuestions.length) {
            const q = caseQuestions[currentStep];
            if (q.type === 'text') {
                const input = document.getElementById(`input-${q.id}`);
                if (input) caseAnswers[q.id] = input.value;
                return true;
            } else if (q.type === 'yes_no_details') {
                const radio = document.querySelector(`input[name="radio-${q.id}"]:checked`);
                if (radio) {
                    caseAnswers[q.id] = { answer: radio.value, details: [] };
                    if (radio.value === 'yes') {
                        const detailsInput = document.getElementById(`details-${q.id}`);
                        if (detailsInput) caseAnswers[q.id].details.push(detailsInput.value);
                    }
                    return true;
                }
            }
        }
        return false;
    }

    function updateUI() {
        const t = translations[currentLanguage];
        
        languageScreen.style.display = 'none';
        questionScreen.style.display = 'none';
        reviewScreen.style.display = 'none';

        if (currentStep === -1) {
            languageScreen.style.display = 'block';
            document.getElementById('lang-title').textContent = translations['english'].select_language; // fallback
        } else if (currentStep >= 0 && currentStep < caseQuestions.length) {
            questionScreen.style.display = 'block';
            const q = caseQuestions[currentStep];
            
            btnNext.textContent = t.btn_next;
            btnPrev.textContent = t.btn_prev;
            
            // Render progress bar (Step X of Y)
            questionProgress.innerHTML = `
                <div style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 5px;">Step ${currentStep + 1} of ${caseQuestions.length}</div>
                <div style="background: #e2e8f0; height: 8px; border-radius: 4px; width: 100%; overflow: hidden;">
                    <div style="background: var(--primary-color); height: 100%; width: ${((currentStep + 1) / caseQuestions.length) * 100}%;"></div>
                </div>
            `;
            
            let html = `<h3 style="margin-top: 15px;">${t[q.translationKey]}</h3>`;
            
            if (q.type === 'text') {
                const prevAns = caseAnswers[q.id] || '';
                html += `<textarea id="input-${q.id}" class="form-control" rows="4">${prevAns}</textarea>`;
            } else if (q.type === 'yes_no_details') {
                const prevAns = caseAnswers[q.id]?.answer || '';
                const prevDet = caseAnswers[q.id]?.details?.[0] || '';
                
                html += `
                    <div style="margin-top: 15px;">
                        <label><input type="radio" name="radio-${q.id}" value="yes" ${prevAns === 'yes' ? 'checked' : ''}> ${t.yes}</label>
                        <label style="margin-left:15px;"><input type="radio" name="radio-${q.id}" value="no" ${prevAns === 'no' ? 'checked' : ''}> ${t.no}</label>
                        <label style="margin-left:15px;"><input type="radio" name="radio-${q.id}" value="not_sure" ${prevAns === 'not_sure' ? 'checked' : ''}> ${t.not_sure}</label>
                    </div>
                    <div id="details-container-${q.id}" style="margin-top: 15px; display: ${prevAns === 'yes' ? 'block' : 'none'};">
                        <textarea id="details-${q.id}" class="form-control" placeholder="Please provide details..." rows="3">${prevDet}</textarea>
                    </div>
                `;
            }
            
            questionContainer.innerHTML = html;

            if (q.type === 'yes_no_details') {
                document.querySelectorAll(`input[name="radio-${q.id}"]`).forEach(radio => {
                    radio.addEventListener('change', (e) => {
                        const container = document.getElementById(`details-container-${q.id}`);
                        if (e.target.value === 'yes') container.style.display = 'block';
                        else container.style.display = 'none';
                    });
                });
            }
        } else {
            // Review Screen
            reviewScreen.style.display = 'block';
            document.getElementById('review-title').textContent = t.review_title;
            btnSubmit.textContent = t.btn_submit;
            btnPrev.textContent = t.btn_prev;
            
            let html = '';
            caseQuestions.forEach(q => {
                html += `<div style="margin-bottom: 20px; padding: 15px; background: #f8fafc; border-radius: 8px;">`;
                html += `<h4 style="color: var(--primary-color); margin-bottom: 5px;">${t[q.translationKey]}</h4>`;
                
                if (q.type === 'text') {
                    html += `<p>${caseAnswers[q.id] || '<em>No answer provided</em>'}</p>`;
                } else if (q.type === 'yes_no_details') {
                    const ans = caseAnswers[q.id];
                    html += `<p><strong>${ans?.answer || 'Not answered'}</strong></p>`;
                    if (ans?.answer === 'yes' && ans?.details?.length > 0) {
                        html += `<p>Details: ${ans.details[0]}</p>`;
                    }
                }
                html += `</div>`;
            });
            reviewContent.innerHTML = html;
        }
    }

    // Init
    updateUI();
});
