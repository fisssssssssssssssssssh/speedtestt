let quotes = {};
let isGameOver = false; // Флаг для завершения игры
let isGameActive = false; // Флаг для отслеживания активности игры

// Функция загрузки цитат
function loadQuotes() {
    fetch('quotes.json')
        .then(response => response.json())
        .then(data => {
            quotes = data;
            if (!isGameActive && !isGameOver) {  // Обновляем цитату только если игра не активна и не завершена
                updateQuote();
            }
        })
        .catch(error => {
            console.error('Error loading quotes:', error);
            alert('Failed to load quotes.');
        });
}

// Вызов функции для загрузки цитат
loadQuotes();

let timer;
let timeLeft;
let charactersTyped = 0;
let currentQuote = "";
let selectedLanguage = "en"; // Язык цитаты
let selectedInterfaceLanguage = "en"; // Язык интерфейса
let totalErrors = 0; // Ошибки за одну итерацию
let correctCharacters = 0; // Количество правильных символов

const timerText = document.querySelector(".curr_time");
const errorsText = document.querySelector(".curr_errors");
const accuracyText = document.querySelector(".curr_accuracy");
const wpmText = document.querySelector(".curr_wpm");
const quoteText = document.querySelector(".quote");
const inputArea = document.querySelector(".input_area");
const restartBtn = document.querySelector(".restart_btn");
const languageSelect = document.getElementById("language");
const timeSelect = document.getElementById("time");
const languageToggleBtn = document.querySelector(".language-toggle");

function updateQuote() {
    if (!quotes[selectedLanguage]) return;

    const quotesArray = quotes[selectedLanguage];
    currentQuote = quotesArray[Math.floor(Math.random() * quotesArray.length)];
    quoteText.innerHTML = currentQuote.split('').map(char => `<span class="quote-char">${char}</span>`).join('');
}

function startGame() {
    if (isGameActive) return; // Если игра уже активна, не начинаем новую

    resetGame();
    selectedLanguage = languageSelect.value;
    timeLeft = parseInt(timeSelect.value);
    timerText.textContent = `${timeLeft}s`;
    updateQuote(); // Обновляем цитату только при старте игры
    inputArea.disabled = false;
    inputArea.value = "";
    inputArea.focus();
    isGameActive = true;
    isGameOver = false; // Игра началась, она не завершена
    timer = setInterval(updateTimer, 1000);
    restartBtn.style.display = "none";
    languageSelect.disabled = true; // Отключаем смену языка во время игры
    timeSelect.disabled = true;
    languageToggleBtn.disabled = true; // Блокируем кнопку смены языка интерфейса во время игры
}

function resetGame() {
    clearInterval(timer);
    totalErrors = 0;
    correctCharacters = 0;
    charactersTyped = 0;
    inputArea.value = "";
    inputArea.disabled = true;
    errorsText.textContent = "0";
    accuracyText.textContent = "100%";
    wpmText.textContent = "0";
    quoteText.textContent = "";
    timerText.textContent = "0s";
    isGameActive = false;
    isGameOver = false;
    restartBtn.style.display = "none";
}

function updateTimer() {
    if (timeLeft > 0) {
        timeLeft--;
        timerText.textContent = `${timeLeft}s`;
    } else {
        finishGame();
    }
}

function finishGame() {
    clearInterval(timer);
    inputArea.disabled = true;
    isGameActive = false;
    isGameOver = true; // Игра завершена
    const wpm = Math.round((correctCharacters / 5) / (parseInt(timeSelect.value) / 60));
    wpmText.textContent = wpm;
    restartBtn.style.display = "block";
    languageSelect.disabled = false; // Разрешаем смену языка после завершения игры
    timeSelect.disabled = false;
    languageToggleBtn.disabled = false; // Разблокируем кнопку смены языка интерфейса после завершения игры
}

function restartGame() {
    resetGame();
    selectedLanguage = languageSelect.value;
    timeLeft = parseInt(timeSelect.value);
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.style.display = 'none';
    }
    startGame();
}

function toggleInterfaceLanguage() {
    selectedInterfaceLanguage = selectedInterfaceLanguage === "en" ? "ru" : "en";

    const languageOptions = {
        en: {
            time: 'Time',
            errors: 'Errors',
            accuracy: 'Accuracy',
            wpm: 'WPM',
            language: 'Language',
            restart: 'Restart',
            flagIcon: "en"
        },
        ru: {
            time: 'Время',
            errors: 'Ошибки',
            accuracy: 'Точность',
            wpm: 'Слова в минуту',
            language: 'Язык',
            restart: 'Перезапуск',
            flagIcon: "ru"
        }
    };

    const currentLang = languageOptions[selectedInterfaceLanguage];

    document.querySelector('.settings label[for="time"]').textContent = currentLang.time;
    document.querySelector('.settings label[for="language"]').textContent = currentLang.language;
    errorsText.previousElementSibling.textContent = currentLang.errors;
    accuracyText.previousElementSibling.textContent = currentLang.accuracy;
    wpmText.previousElementSibling.textContent = currentLang.wpm;
    restartBtn.textContent = currentLang.restart;

    languageToggleBtn.textContent = currentLang.flagIcon;

    // Обновление только интерфейса, цитата не меняется во время игры
    if (isGameOver) {
        updateQuote(); // Обновляем цитату только если игра завершена
    }
}

inputArea.addEventListener("input", () => {
    if (!isGameActive) startGame();

    const input = inputArea.value;
    charactersTyped++;

    let errors = 0;

    const quoteChars = document.querySelectorAll('.quote-char');
    correctCharacters = 0;

    for (let i = 0; i < currentQuote.length; i++) {
        const charSpan = quoteChars[i];
        if (i < input.length) {
            if (input[i] === currentQuote[i]) {
                charSpan.style.color = "#8FBC8F"; // Мягкий зелёный для правильных символов
                charSpan.style.textDecoration = "none";
                correctCharacters++;
            } else {
                charSpan.style.color = "rgba(255, 0, 0, 0.6)"; // Полупрозрачный красный для ошибок
                charSpan.style.textDecoration = "none";
                errors++;
            }
        } else {
            charSpan.style.color = "black";
            charSpan.style.textDecoration = "none";
        }

        if (i === input.length) {
            charSpan.style.textDecoration = "underline"; // Подчёркивание текущей позиции
            charSpan.style.color = "black";
        } else {
            charSpan.style.textDecoration = "none";
        }
    }

    totalErrors = errors;
    errorsText.textContent = totalErrors;

    const accuracy = input.length > 0 ? Math.round((correctCharacters / input.length) * 100) : 100;
    accuracyText.textContent = `${accuracy}%`;

    if (input === currentQuote) {
        updateQuote();
        inputArea.value = "";
    }
});

function finishGame() {
    clearInterval(timer);
    inputArea.disabled = true;
    isGameActive = false;
    isGameOver = true;

    // Рассчитываем результаты
    const wpm = Math.round((correctCharacters / 5) / (parseInt(timeSelect.value) / 60));
    const accuracy = charactersTyped > 0 ? Math.round((correctCharacters / charactersTyped) * 100) : 100;

    // Обновляем текст в модальном окне
    document.getElementById("wpmResult").textContent = wpm;
    document.getElementById("accuracyResult").textContent = accuracy + "%";
    document.getElementById("errorsResult").textContent = totalErrors;

    // Генерируем текст для соцсетей
    const shareText = `I scored ${wpm} WPM with ${accuracy}% accuracy in this typing test! Can you beat me?`;

    // Создаём ссылки для Twitter и Telegram
    const twitterShare = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    const telegramShare = `https://t.me/share/url?url=https://example.com&text=${encodeURIComponent(shareText)}`;

    document.getElementById("shareTwitter").setAttribute("href", twitterShare);
    document.getElementById("shareTelegram").setAttribute("href", telegramShare);

    // Показ модального окна
    document.getElementById("endGameModal").style.display = "block";

    // Разблокируем элементы интерфейса
    restartBtn.style.display = "block";
    languageSelect.disabled = false;
    timeSelect.disabled = false;
    languageToggleBtn.disabled = false;
}

// Закрытие модального окна
document.getElementById("closeModalBtn").addEventListener("click", () => {
    document.getElementById("endGameModal").style.display = "none";
});

document.getElementById("closeModalBtnBottom").addEventListener("click", () => {
    document.getElementById("endGameModal").style.display = "none";
});



restartBtn.addEventListener("click", restartGame);

languageToggleBtn.addEventListener("click", toggleInterfaceLanguage);
