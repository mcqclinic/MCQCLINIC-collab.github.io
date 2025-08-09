document.addEventListener('DOMContentLoaded', () => {
    const views = {
        home: document.getElementById('home-view'),
        quiz: document.getElementById('quiz-view'),
        results: document.getElementById('results-view'),
        review: document.getElementById('review-view'),
    };
    const configModal = document.getElementById('config-modal');
    const quizModeCards = document.querySelectorAll('.quiz-mode-card');
    const startQuizBtn = document.getElementById('start-quiz-btn');
    const cancelQuizBtn = document.getElementById('cancel-quiz-btn');
    const nextQuestionBtn = document.getElementById('next-question-btn');
    const restartQuizBtn = document.getElementById('restart-quiz-btn');
    const reviewAnswersBtn = document.getElementById('review-answers-btn');
    const backToHomeBtn = document.getElementById('back-to-home-btn');

    const questionTextEl = document.getElementById('question-text');
    const optionsContainerEl = document.getElementById('options-container');
    const questionCounterEl = document.getElementById('question-counter');
    const progressBarEl = document.getElementById('progress-bar');
    const timerEl = document.getElementById('timer');
    const quizTypeDisplayEl = document.getElementById('quiz-type-display');
    
    const feedbackContainerEl = document.getElementById('feedback-container');
    const explanationTextEl = document.getElementById('explanation-text');
    
    const finalScoreEl = document.getElementById('final-score');
    const totalPossibleScoreEl = document.getElementById('total-possible-score');
    const resultsMessageEl = document.getElementById('results-message');
    const reviewContainerEl = document.getElementById('review-container');

    const customAlertModal = document.getElementById('custom-alert-modal');
    const alertMessageEl = document.getElementById('alert-message');
    const alertOkBtn = document.getElementById('alert-ok-btn');

    let allQuestions = [];
    let currentQuizQuestions = [];
    let userAnswers = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let timerInterval;
    let timeLeft = 0;
    let currentTestType = '';

    let subjectWeightageChart = null;
    let resultsChart = null;
    
    const quizConfig = {
        'Daily': { questions: 10, time: 10 * 60 },
        'Weekly': { questions: 50, time: 50 * 60 },
        'Monthly': { questions: 100, time: 100 * 60 },
        'Mock': { questions: 180, time: 180 * 60 }
    };

    function showCustomAlert(message) {
        alertMessageEl.textContent = message;
        customAlertModal.classList.remove('hidden');
    }

    function hideCustomAlert() {
        customAlertModal.classList.add('hidden');
    }

    function fetchQuestions() {
        fetch('https://raw.githubusercontent.com/user/repo/main/questions.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok. Using fallback data.');
            }
            return response.json();
        })
        .then(data => {
            allQuestions = data.questions;
            initializeDashboard();
        })
        .catch(error => {
            console.error('Error fetching questions.json:', error);
            allQuestions = getFallbackQuestions().questions;
            initializeDashboard();
        });
    }

    function getFallbackQuestions() {
        return {
            "questions": [
                // ... (keep your fallback questions data here exactly as in the original HTML)
            ]
        };
    }

    function initializeDashboard() {
        const ctx = document.getElementById('subject-weightage-chart').getContext('2d');
        if (subjectWeightageChart) {
            subjectWeightageChart.destroy();
        }
        subjectWeightageChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Biology', 'Chemistry', 'Physics', 'English', 'Logical Reasoning'],
                datasets: [{
                    label: 'Subject Weightage',
                    data: [45, 25, 20, 5, 5],
                    backgroundColor: ['#14b8a6', '#0891b2', '#6366f1', '#f97316', '#84cc16'],
                    borderColor: '#f8f7f4',
                    borderWidth: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            font: {
                                size: 14,
                                family: 'Inter'
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: ${context.raw}%`;
                            }
                        }
                    }
                }
            }
        });
    }

    function showView(viewName) {
        Object.values(views).forEach(view => view.classList.remove('active'));
        views[viewName].classList.add('active');
        window.scrollTo(0, 0);
    }

    function openConfigModal(testType) {
        currentTestType = testType;
        document.getElementById('config-title').textContent = `${testType} Test Configuration`;
        
        const numQuestionsSelect = document.getElementById('num-questions-select');
        const subjectSelect = document.getElementById('subject-select');

        if (testType === 'Mock') {
            numQuestionsSelect.value = "180";
            numQuestionsSelect.disabled = true;
            subjectSelect.value = "All";
            subjectSelect.disabled = true;
        } else {
            numQuestionsSelect.disabled = false;
            subjectSelect.disabled = false;
            const options = numQuestionsSelect.querySelectorAll('option');
            options.forEach(opt => {
                if(parseInt(opt.value) > 50 && testType !== 'Monthly') opt.style.display = 'none';
                else opt.style.display = 'block';
            });
        }

        configModal.classList.remove('hidden');
    }

    function closeConfigModal() {
        configModal.classList.add('hidden');
    }

    function startQuiz() {
        const subject = document.getElementById('subject-select').value;
        let numQuestions = parseInt(document.getElementById('num-questions-select').value);

        let filteredQuestions = allQuestions;
        if (subject !== 'All') {
            filteredQuestions = allQuestions.filter(q => q.subject === subject);
        }

        if (currentTestType === 'Mock') {
            numQuestions = 180;
            currentQuizQuestions = shuffleArray(filteredQuestions).slice(0, numQuestions);
        } else {
             currentQuizQuestions = shuffleArray(filteredQuestions).slice(0, numQuestions);
        }
        
        if(currentQuizQuestions.length === 0){
            showCustomAlert("Not enough questions available for this selection. Please try different options.");
            return;
        }

        closeConfigModal();
        
        currentQuestionIndex = 0;
        score = 0;
        userAnswers = [];
        quizTypeDisplayEl.textContent = `${subject} ${currentTestType} Test`;

        timeLeft = quizConfig[currentTestType]?.time || numQuestions * 60;
        
        showView('quiz');
        loadQuestion();
        startTimer();
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function loadQuestion() {
        if (currentQuestionIndex >= currentQuizQuestions.length) {
            endQuiz();
            return;
        }

        feedbackContainerEl.classList.add('hidden');
        nextQuestionBtn.disabled = true;

        const question = currentQuizQuestions[currentQuestionIndex];
        questionCounterEl.textContent = `Question ${currentQuestionIndex + 1} of ${currentQuizQuestions.length}`;
        questionTextEl.innerHTML = question.questionText;
        optionsContainerEl.innerHTML = '';

        question.options.forEach(option => {
            const optionEl = document.createElement('button');
            optionEl.classList.add('quiz-option', 'w-full', 'text-left', 'p-4', 'border-2', 'border-gray-300', 'rounded-lg', 'hover:bg-teal-50', 'hover:border-teal-400', 'transition');
            optionEl.dataset.optionId = option.id;
            optionEl.innerHTML = `<span class="font-bold mr-2">${option.id.toUpperCase()}.</span> ${option.text}`;
            optionEl.addEventListener('click', () => selectAnswer(option.id));
            optionsContainerEl.appendChild(optionEl);
        });

        progressBarEl.style.width = `${((currentQuestionIndex + 1) / currentQuizQuestions.length) * 100}%`;
    }
    
    function selectAnswer(selectedOptionId) {
        const question = currentQuizQuestions[currentQuestionIndex];
        userAnswers[currentQuestionIndex] = selectedOptionId;

        const isCorrect = selectedOptionId === question.correctAnswerId;
        if (isCorrect) {
            score++;
        }

        Array.from(optionsContainerEl.children).forEach(btn => {
            btn.disabled = true;
            const optionId = btn.dataset.optionId;
            if (optionId === question.correctAnswerId) {
                btn.classList.add('correct');
            } else if (optionId === selectedOptionId) {
                btn.classList.add('incorrect');
            }
        });

        explanationTextEl.innerHTML = question.explanation;
        feedbackContainerEl.classList.remove('hidden');
        nextQuestionBtn.disabled = false;
        nextQuestionBtn.focus();
    }

    function handleNextQuestion() {
        currentQuestionIndex++;
        loadQuestion();
    }

    function startTimer() {
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            timeLeft--;
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timerEl.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

            if (timeLeft <= 0) {
                endQuiz();
            }
        }, 1000);
    }

    function endQuiz() {
        clearInterval(timerInterval);
        finalScoreEl.textContent = score;
        totalPossibleScoreEl.textContent = `/ ${currentQuizQuestions.length}`;
        
        const percentage = Math.round((score / currentQuizQuestions.length) * 100);
        let message = "";
        if (percentage >= 80) message = "Excellent work! You're on the right track.";
        else if (percentage >= 60) message = "Good job! Keep practicing to improve further.";
        else message = "Don't give up! Review your answers and try again.";
        resultsMessageEl.textContent = message;

        renderResultsChart();
        showView('results');
    }
    
    function renderResultsChart() {
        const ctx = document.getElementById('results-chart').getContext('2d');
        if (resultsChart) {
            resultsChart.destroy();
        }
        resultsChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Your Score'],
                datasets: [
                    {
                        label: 'Correct Answers',
                        data: [score],
                        backgroundColor: '#14b8a6',
                        borderRadius: 6,
                    },
                    {
                        label: 'Incorrect Answers',
                        data: [currentQuizQuestions.length - score],
                        backgroundColor: '#fca5a5',
                        borderRadius: 6,
                    }
                ]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { stacked: true, display: false },
                    y: { stacked: true, display: false }
                },
                plugins: { legend: { display: false }, tooltip: { enabled: false } }
            }
        });
    }

    function showReview() {
        reviewContainerEl.innerHTML = '';
        currentQuizQuestions.forEach((q, index) => {
            const userAnswerId = userAnswers[index];
            const userAnswerText = q.options.find(opt => opt.id === userAnswerId)?.text || "Not Answered";
            const correctAnswerText = q.options.find(opt => opt.id === q.correctAnswerId).text;

            const reviewItem = document.createElement('div');
            reviewItem.classList.add('p-4', 'border', 'border-gray-200', 'rounded-lg');
            
            let optionsHtml = q.options.map(opt => {
                let classes = 'block p-3 my-2 rounded-md border-2';
                if (opt.id === q.correctAnswerId) {
                    classes += ' border-green-500 bg-green-50';
                } else if (opt.id === userAnswerId) {
                    classes += ' border-red-500 bg-red-50';
                } else {
                    classes += ' border-gray-200';
                }
                return `<div class="${classes}">${opt.id.toUpperCase()}. ${opt.text}</div>`;
            }).join('');

            reviewItem.innerHTML = `
                <p class="font-semibold text-gray-600">Question ${index + 1}</p>
                <h3 class="font-bold text-lg my-2">${q.questionText}</h3>
                <div>${optionsHtml}</div>
                <div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
                    <h4 class="font-bold text-blue-800">Explanation</h4>
                    <p class="text-blue-900">${q.explanation}</p>
                </div>
            `;
            reviewContainerEl.appendChild(reviewItem);
        });
        showView('review');
    }

    quizModeCards.forEach(card => {
        card.addEventListener('click', () => openConfigModal(card.dataset.testType));
    });
    
    startQuizBtn.addEventListener('click', startQuiz);
    cancelQuizBtn.addEventListener('click', closeConfigModal);
    nextQuestionBtn.addEventListener('click', handleNextQuestion);
    restartQuizBtn.addEventListener('click', () => showView('home'));
    reviewAnswersBtn.addEventListener('click', showReview);
    backToHomeBtn.addEventListener('click', () => showView('home'));
    alertOkBtn.addEventListener('click', hideCustomAlert);

    fetchQuestions();
});
