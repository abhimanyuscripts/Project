import { quizzes } from './quiz-data.js';

const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

const homeScreen = document.getElementById('home-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultsScreen = document.getElementById('results-screen');

const quizHeaderContent = document.getElementById('quiz-header-content');
const subjectsContainer = document.querySelector('.subjects');
const questionNumber = document.querySelector('.question-number');
const questionText = document.querySelector('.question-text');
const progressBar = document.querySelector('.progress-bar');
const optionsContainer = document.querySelector('.options-container');
const submitBtn = document.getElementById('submit-answer');
const nextBtn = document.getElementById('next-question');
const errorMsg = document.getElementById('error-message');
const playAgainBtn = document.getElementById('play-again');
const finalScoreCard = document.querySelector('.final-score-card');

let currentQuiz = '';
let currentQuestionIndex = 0;
let score = 0;
let selectedOption = null;

// Theme switcher logic
themeToggle.addEventListener('change', () => {
    body.classList.toggle('light-theme', themeToggle.checked);
    body.classList.toggle('dark-theme', !themeToggle.checked);
});

// Populate subjects on home screen
Object.keys(quizzes).forEach(subject => {
    const subjectBtn = document.createElement('button');
    subjectBtn.className = 'subject-btn';
    subjectBtn.innerHTML = `
        <span class="icon icon-${subject.toLowerCase()}">
            <img src="data:image/svg+xml;base64,${getIcon(subject)}" alt="${subject} icon">
        </span>
        ${subject}
    `;
    subjectBtn.addEventListener('click', () => startQuiz(subject));
    subjectsContainer.appendChild(subjectBtn);
});

function getIcon(subject) {
    const icons = {
        HTML: 'PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNi42NjY5OSAxMC4wMDAzTDMuMzMzNjYgMzQuMTY3QzIuOTk3NTcgMzcuMjAyMSAzLjEyODg4IDQwIDYuMjUwMzMgNDBINy45MTY5OUwyNS44MzM3IDQwQzI4Ljk1ODMgNDAgMjkuOTg5NiAzNy4yMDIxIDI5LjU1MzUgMzQuMTY3TDMzLjMzMzcgMTAuMDAwM0wyMCAwTDE2LjY2NyAwbC0xMCAxMC4wMDAzWiIgZmlsbD0iI0ZGRjFFOSIvPjxwYXRoIGQ9Ik0yMCAwTDIzLjMzMzMgMy4zMzMzTDE5LjE2NjcgNy41TDIwIDBaIiBmaWxsPSIjRkZDNzA1Ii8+PHBhdGggZD0iTTIwIDBMMTYuNjY2NyAzLjMzMzNMMjAuODMzMyA3LjVMMjAgMFoiIGZpbGw9IiNFMEU3RkYiLz48cGF0aCBkPSJNNi42NjY5OSA5Ljk5OTk4TDIwIDIwVjBMMTYuNjY3IDBMMi41IDExLjY2NjZDNy4wODM2NiAxMi45MTY2IDExLjY2NyAxMS42NjY2IDEzLjMzMzcgOS45OTk5OEw2LjY2Njk5IDkuOTk5OThaIiBmaWxsPSIjRkZDNzA1Ii8+PHBhdGggZD0iTTMzLjMzMzcgOS45OTk5OEwxMy4zMzM3IDkuOTk5OThDMTguMzMzNyAxMS42NjY2IDIyLjkyMDMgMTIuOTE2NiAyNy41IDExLjY2NjZMMjAgMEwyMy4zMzM3IDNMMzMuMzMzNyA5Ljk5OTk4WiIgZmlsbD0iI0UwRTdGRiIvPjxwYXRoIGQ9Ik0yMCAzNS44MzMzVjIwTDYuNjY2OTkgOS45OTk5OEwzLjMzMzY2IDM0LjE2NjZDMi45OTc1NyAzNy4yMDIxIDMuMTI4ODggNDAgNi4yNTAzMyA0MEg3LjkxNjk5TDIwIDM1LjgzMzNaIiBmaWxsPSIjRkZDNzA1Ii8+PHBhdGggZD0iTTIwIDM1LjgzMzNWMjBMMzMuMzMzNyA5Ljk5OTk4TDI5LjU1MzUgMzQuMTY2NkMyOS45ODk2IDM3LjIwMjEgMjguOTU4MyA0MCAyNS44MzM3IDQwSDIwVjM1LjgxNjdaIiBmaWxsPSIjRTBFN0ZGIi8+PC9zdmc+',
        CSS: 'PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTQuMTY2MyAyNS44MzM0QzEzLjgxOTQgMjUuODM0MSAxMy41MDM5IDI1LjY1MDggMTMuMzM3MSAyNS4zNTk1QzEzLjE3MDQgMjUuMDY4MSAxMy4xNzM0IDI0LjcxMTcgMTMuMzQ1NiAyNC40MTlMNS4wMTE4OSAxMC40MjE1QzQuODMyOTQgMTAuMjQ1IDQuNzIxNjcgMTAuMDA4MiA0LjY4OTQyIDkuNzQyNzdDNC42NTcxOCA5LjQ3NzM0IDQuNzE2MjUgOS4yMTU2IDQuODUyMzkgOC45OTM5M0M0Ljk4ODUzIDguNzcyMjcgNS4xOTYyNiA4LjYwNDQ2IDUuNDQyNDQgOC41MTYzNEM1LjY4ODYxIDguNDI4MjIgNS45NTk2NSA4LjQyNzg2IDYuMjA5NTYgOC41MTU3MkwxNC41NDMzIDIyLjUwMzVDMTQuNzA4MSAyMi4yMTAxIDE0Ljk4NjEgMjIuMDAyMSAxNS4yNDE3IDIyLjA3NTNDMTUuNDk3MiAyMi4xNDg0IDE1LTY5NDkgMjIuMzg3OCAxNS43ODI1IDIyLjUzMDVDMTUuOTY1OSAyMi42NDUxIDE2LjA2OTYgMjIuODIwNSAxNi4wNzkyIDIyLjk4NDdDMTYuMDg4NyAyMy4xNDg5IDE2LjAwMzggMjMuMzA0MyAxNS44NTg5IDIzLjQxNjdMMTQuMTY2MyAyNS44MzM0WiIgZmlsbD0iIzI2RDc4MiIvPjxwYXRoIGQ9Ik0yMC4yMjYgOC44MzM0NUMxOS4yNDEgOC41MTA1OCAxOC4xNzQ1IDguNjExMDggMTcuMjM1OCA5LjExMzA5TDI0LjQyNTYgMjEuNjcxM0MzNC4wMDk2IDIwLjI4MjYgMzMuMTc5NiA4LjMzNDE3IDI0LjQyNTYgOC4zMzQxN0MyMy4wMjgyIDguMzM0MTcgMjEuNjMwOCA4LjUwODk1IDIwLjIyNiA4LjgzMzQ1WiIgZmlsbD0iI0UwRkRFRiIvPjxwYXRoIGQ9Ik0xNy4yMzU3IDkuMTEzMDlDNS4wOTk1OCA4Ljc1NDE3IDUuNDE2MjUgMjEuNjcxMyAxNy4yMzU3IDIxLjY3MTNDMTguODQ1NyAyMS42NzEzIDIwLjM4NzQgMjEuMjk2NSAyMS43MzU3IDIwLjU4MzRMMTcuMjM1NyA5LjExMzA5WiIgZmlsbD0iIzJGQjc3NiIvPjxwYXRoIGQ9Ik0yNC40MjU4IDguMzMzMzNDMzQuODM3NSAxMC4wNjY3IDM0LjkwNDIgMjEuNjcxNyAyNC40MjU4IDIxLjY3MTdWMjAuNDE2N0MyOS45MDQyIDIwLjQxNjcgMzAuMzA0MiAxMy40NSA3NSAyNC40MjU4IDguMzMzMzNaIiBmaWxsPSIjMjZEDzc4MiIvPjxwYXRoIGQ9Ik0zMy4zMzM3IDE3LjA4MzRDMzMuMzMzNyAyNi41MjA5IDI1Ljg1NDIgMzQuMDAwMSAyNC40MjU4IDMzLjk4MzRDMTUuNDM3NSAzMy45NjY3IDE2LjY2NjcgMTcuMDgzNCAxNi42NjY3IDE3LjA4MzRDMjAuNTA0MiAxNS42NDU5IDI1LjA0NTggMTUuNTg3NiAyOS4wNzA4IDE2LjcxNjdDMzAuODM3NSAxNy4wODM0IDMyLjI1NDIgMTcuMDgzNCAzMy4zMzM3IDE3LjA4MzRaIiBmaWxsPSIjRTBGRERFRiIvPjxwYXRoIGQ9Ik0xNi42NjY3IDE3LjA4MzNDNS40MTY2NyAxOC43NSA1LjA5NTgzIDMzLjk4MzMgMTUuNDM3NSAzMy45NjY3QzE1Ljk3MDggMzMuOTY2NyAxNi40NTA4IDMzLjgyMDkgMTYuODMzMyAzMy41NjY3TDE2LjY2NjcgMTcuMDgzM1oiIGZpbGw9IiMyRkI3NzYiLz48cGF0aCBkPSJNMjQuNDI1OCAzMy45ODM0QzM0LjkwNDIgMzIuMjUgMzQuODM3NSAxNy4wODM0IDI0LjQyNTggMTcuMDgzNFYxOC43NUMzMC4zMDQyIDE4Ljc1IDMwLjEwNDIgMjguMTEyNSAyNC40MjU4IDMzLjk4MzRaIiBmaWxsPSIjMjZENzc4MiIvPjwvc3ZnPg==',
        Javascript: 'PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTUgMzVDMTkuNjY2NyAzNi42NjY3IDIxIDM4LjMzMzMgMjEgNDBDMjEgMzguMzMzMyAyMi4zMzMzIDM2LjY2NjcgMjUgMzVIMTVaIiBmaWxsPSIjMzA2QkZGIi8+PHBhdGggZD0iTTMwIDQwSDEwQzQuMTY2NjcgNDAgMCAzNS44MzMzIDAgMzBWMTBDMC4wMTA0MTY3IDQuMTc3MDggNC4xNzcwOCAwLjAxMDQxNjcgMTAgMEgzMEMzNS44MzMzIDAgNDAgNC4xNjY2NyA0MCAxMFYzMEM0MCAzNS44MzMzIDM1LjgzMzMgNDAgMzAgNDBaIiBmaWxsPSIjRUJGMkZGIi8+PHBhdGggZD0iTTI1IDM1QzIyLjMzMzMgMzYuNjY2NyAyMSAzOC4zMzMzIDIxIDQwQzE1IDQwIDEwIDM4LjMzMzMgMTAgMzVWNDBIMzBWMzVDMjcuNSA0MCAyNi42NjY3IDQwIDI1IDM1WiIgZmlsbD0iIzNBNjdGRiIvPjxwYXRoIGQ9Ik0xMy4zMzMzIDEwSDEwVjE1QzEwIDE1IDEwIDE2LjY2NjcgMTEuNjY2NyAxNi42NjY3QzEzLjMzMzMgMTYuNjY2NyAxMy4zMzMzIDE1IDEzLjMzMzMgMTVMMTMuMzMzMyAxMFoiIGZpbGw9IiMzMDZCRkYiLz48cGF0aCBkPSJNMjYuNjY2NyAxMEgyNS44MzM0VjE2LjY2NjdIMzBWMThLjMzMzRIMjQuMTY2N1YxMEgyNi42NjY3WiIgZmlsbD0iIzMwNkJGRiIvPjxwYXRoIGQ9Ik0xOC4zMzM0IDEwSDE2LjY2NjdWMThIMjEuNjY2N1YxNi42NjY3SDE4LjMzMzRWMTBIMTguMzMzNFoiIGZpbGw9IiMzMDZCRkYiLz48L3N2Zz4=',
        Accessibility: 'PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCiB4D0iMCAwIDQwIDQwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxnIGNsaXAtcGF0aD0idXJsKCNjbGlwMCkiPjxwYXRoIGQ9Ik0yMS4yNSA4LjEyNUMxOS4zNzUgNy40NTgzMyAxNy4wNDU4IDcuMjA4MzMgMTQuNzUgNy40NTgzM0MxMS42MjUgNy43OTU4MyA4Ljc3NSA5LjIwODMzIDYuNTg3NSA4LjU0MTY3QzIuNjI1IDcuMzM3NSAwIDEwLjM3MDggMCAxNC41ODMzVjE1LjQxNjdDMCAxOS42MjkyIDIuNjI1IDIyLjY2MjUgNi41ODc1IDIxLjQ1ODNDOC43NzUgMjAuNzkwOCAxMS42MjUgMjIuMjA0MiAxNC43NSAyMi41NDE3QzE3LjA0NTggMjIuNzkxNyAxOS4zNzUgMjIuNTQxNyAyMS4yNSAyMS44NzVDMjQuNzUgMjAuNzUgMjcuNSAxOC42NjY3IDI3LjUgMTQuOTU4M0MyNy41IDExLjI1IDE0Ljc1IDkuMjUgMjEuMjUgOC4xMjVaIiBmaWxsPSIjRjZFN0ZGIi8+PHBhdGggZD0iTTM1LjQxNjcgMTUuNDE2N0MzNS40MTY3IDEwLjM3MDggMzIuNzkyNSA3LjMzNzUgMjguNDE2NyA4LjU0MTY3QzI2LjIyNSA5LjIwODMzIDIzLjM3NSAyLjcwODMzIDIwLjI1IDcuNDU4MzNDMTcuOTU0MiAyLjIwODMzIDE1LjYyNSA3LjQ1ODM3IDEzLjc1IDguMTI1QzE3LjI1IDkuMjUgMjAuMjUgMTEuMjUgMjAuMjUgMTQuOTU4M0MyMC4yNSAxOC42NjY3IDE3LjI1IDIwLjc1IDEzLjc1IDIxLjg3NUMxNS42MjUgMjIuNTQxNyAxNy45NTQyIDIyLjc5MTcgMjAuMjUgMjIuNTQxN0MyMy4zNzUgMjIuMjA0MiAyNi4yMjUgMjAuNzkwOCAyOC40MTY3IDIxLjQ1ODNDMzIuNzkyNSAyMi42NjI1IDM1LjQxNjcgMTkuNjI5MiAzNS40MTY3IDE1LjQxNjdaIiBmaWxsPSIjQzczN0ZGIi8+PHBhdGggZD0iTTEzLjM3NSA4LjM3NUMxNC4yNSA5LjYyNSAxNC43NSA3LjA4MzMzIDE1LjE2NjcgNS42MjVDMTQuODc1IDMuNzUgMTIuNSA0LjEyNSAxMS43NSA0LjkxNjY3QzExLjUgNS41NDE2NyAxMC41NDU4IDguMjkxNjcgMTAuNDE2NyA5LjU4MzMzQzkuNjY2NjcgMTEuOTU4MyAxMS4yNSAxNS40MTY3IDExLjY2NjcgMTguOTU4M0MxMi4yMDQyIDI0LjA4MzMgMTAuNDE2NyAyOC43MDQyIDkuMTY2NjcgMzAuNDE2N0M4LjEyNSA0MCA5LjU4MzMzIDM4LjM3NSA5LjU4MzMzIDM4LjM3NUM5LjU4MzMzIDM4LjM3NSAxNC41NDU4IDM1LjU4MzMgMTQuOTU4MyAzMy4zNzVDMTUuMzcxNyAzMS4xNjY3IDEyLjUgMjkuMTI1IDEyLjUgMjYuMjVDMTIuNSAyMy4zNzUgMTQuNjI1IDIwLjM3NSAxNS41NDE3IDE3LjkxNjdDMTYuNDU4MyAxNS40NTgzIDE0Ljc5NTggMTIuNTg3NSAxNC4yNSA5LjYyNUMxMy45NTgzIDguOTk1ODMgMTMuNjY2NyA4LjYyNSAxMy4zNzUgOC4zNzVaIiBmaWxsPSIjQTczN0ZGIi8+PC9nPjxkZWZzPjxjbGlwUGF0aCBpZD0iY2xpcDAiPjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgZmlsbD0id2hpdGUiLz48L2RlZnM+PC9zdmc+',
    };
    return icons[subject];
}

function startQuiz(subject) {
    currentQuiz = subject;
    currentQuestionIndex = 0;
    score = 0;
    homeScreen.classList.add('hidden');
    resultsScreen.classList.add('hidden');
    quizScreen.classList.remove('hidden');
    updateHeader();
    loadQuestion();
}

function updateHeader() {
    if (currentQuiz) {
        quizHeaderContent.innerHTML = `
            <span class="icon icon-${currentQuiz.toLowerCase()}">
                <img src="data:image/svg+xml;base64,${getIcon(currentQuiz)}" alt="${currentQuiz} icon">
            </span>
            <span class="title">${currentQuiz}</span>
        `;
    } else {
        quizHeaderContent.innerHTML = '';
    }
}

function loadQuestion() {
    const quizData = quizzes[currentQuiz];
    const question = quizData[currentQuestionIndex];

    questionNumber.textContent = `Question ${currentQuestionIndex + 1} of ${quizData.length}`;
    questionText.textContent = question.question;
    progressBar.style.width = `${((currentQuestionIndex + 1) / quizData.length) * 100}%`;
    optionsContainer.innerHTML = '';

    const letters = ['A', 'B', 'C', 'D'];
    question.options.forEach((option, index) => {
        const optionEl = document.createElement('div');
        optionEl.className = 'option';
        optionEl.innerHTML = `<span class="icon">${letters[index]}</span> ${option}`;
        optionEl.addEventListener('click', () => selectOption(optionEl, option));
        optionsContainer.appendChild(optionEl);
    });

    submitBtn.classList.remove('hidden');
    nextBtn.classList.add('hidden');
    errorMsg.classList.add('hidden');
    selectedOption = null;
}

function selectOption(element, option) {
    document.querySelectorAll('.option').forEach(el => el.classList.remove('selected'));
    element.classList.add('selected');
    selectedOption = option;
    errorMsg.classList.add('hidden');
}

submitBtn.addEventListener('click', () => {
    if (!selectedOption) {
        errorMsg.classList.remove('hidden');
        return;
    }

    const correctAnswer = quizzes[currentQuiz][currentQuestionIndex].answer;
    const options = document.querySelectorAll('.option');
    let correctIcon = `<img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMjQgMTJDMjQgMTguNjI3NCAxOC42Mjc0IDI0IDEyIDI0QzUuMzczNTUgMjQgMCAxOC42Mjc0IDAgMTJDMC4wMDQ3NzQwMSA1LjM3NzI3IDUuMzc3MjcgMC4wMDQ3NzQwMSAxMiAwQzE4LjYyNzQgMCAyNCA1LjM3MjU1IDI0IDEyWiIgZmlsbD0iIzI2RDc4MiIvPjxwYXRoIGQ9Ik0xOC4xODE4IDguNTQ1NDVMMTAuMjI3MyAxNi41TDYuMzYzNjQgMTIuNjM2NCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L3N2Zz4=" alt="Correct">`;
    let incorrectIcon = `<img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMjQgMTJDMjQgMTguNjI3NCAxOC42Mjc0IDI0IDEyIDI0QzUuMzczNTUgMjQgMCAxOC42Mjc0IDAgMTJDMC4wMDQ3NzQwMSA1LjM3NzI3IDUuMzc3MjcgMC4wMDQ3NzQwMSAxMiAwQzE4LjYyNzQgMCAyNCA1LjM3MjU1IDI0IDEyWiIgZmlsbD0iI0VFNVQ1NCIvPjxwYXRoIGQ9Ik0xNy4zMzMzIDYuNjY2NjlMNi42NjY2MyAxNy4zMzM0TTE3LjMzMzMgMTcuMzMzNEw2LjY2NjYzIDYuNjY2NjkiIHN0cm9rZT0id2hpdGUiIHN0cm9keS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PC9zdmc+" alt="Incorrect">`;


    options.forEach(opt => {
        opt.style.pointerEvents = 'none'; // Disable clicking after submit
        const optionText = opt.textContent.trim().substring(2);
        if (optionText === correctAnswer) {
            opt.classList.add('correct');
            opt.innerHTML += correctIcon;
        } else if (opt.classList.contains('selected')) {
            opt.classList.add('incorrect');
             opt.innerHTML += incorrectIcon;
        }
    });

    if (selectedOption === correctAnswer) {
        score++;
    }

    submitBtn.classList.add('hidden');
    nextBtn.classList.remove('hidden');
});


nextBtn.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizzes[currentQuiz].length) {
        loadQuestion();
    } else {
        showResults();
    }
});

function showResults() {
    quizScreen.classList.add('hidden');
    resultsScreen.classList.remove('hidden');
    
    finalScoreCard.innerHTML = `
        <div class="header-content">
            <span class="icon icon-${currentQuiz.toLowerCase()}">
                 <img src="data:image/svg+xml;base64,${getIcon(currentQuiz)}" alt="${currentQuiz} icon">
            </span>
            <span class="title">${currentQuiz}</span>
        </div>
        <div class="final-score">${score}</div>
        <p class="total-questions">out of ${quizzes[currentQuiz].length}</p>
    `;
}

playAgainBtn.addEventListener('click', () => {
    resultsScreen.classList.add('hidden');
    homeScreen.classList.remove('hidden');
    quizHeaderContent.innerHTML = ''; // Clear header
});