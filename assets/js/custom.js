// =====================
// === MEMORY GAME ===
// =====================

// Global variables for memory game
let board = document.getElementById("gameBoard");
let movesSpan = document.getElementById("moves");
let matchesSpan = document.getElementById("matches");
let winMessage = document.getElementById("winMessage");
let bestEasy = document.getElementById("best-easy");
let bestHard = document.getElementById("best-hard");
let timeSpan = document.getElementById("time");
let startBtn = document.getElementById("startGame");
let resetBtn = document.getElementById("resetGame");
let easyBtn = document.getElementById("levelEasy");
let hardBtn = document.getElementById("levelHard");

let level = "easy";
let moves = 0;
let matches = 0;
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let timer = 0;
let timerInterval = null;

const fruitsEasy = ["🍎","🍌","🍇","🍒","🍓","🍉"];
const fruitsHard = ["🍎","🍌","🍇","🍒","🍓","🍉","🥝","🍑","🍍","🍐","🍊","🍈"];

// Timer system
function startTimer() {
    timer = 0;
    timeSpan.textContent = "0:00";
    clearInterval(timerInterval);
    
    timerInterval = setInterval(() => {
        timer++;
        timeSpan.textContent = formatTime(timer);
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function formatTime(sec) {
    let m = Math.floor(sec / 60);
    let s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
}

// Game initialization
function startGame() {
    winMessage.classList.add("hidden");
    moves = 0;
    matches = 0;
    
    movesSpan.textContent = moves;
    matchesSpan.textContent = matches;
    
    startTimer();
    
    let fruits = level === "easy" ? fruitsEasy : fruitsHard;
    let totalCards = level === "easy" ? 12 : 24;
    
    let selected = fruits.slice(0, totalCards / 2);
    let cards = [...selected, ...selected].sort(() => Math.random() - 0.5);
    
    board.innerHTML = "";
    board.className = level;
    
    cards.forEach(icon => {
        let card = document.createElement("div");
        card.classList.add("card");
        card.dataset.icon = icon;
        card.innerHTML = `
            <div class="front"></div>
            <div class="back">${icon}</div>
        `;
        card.addEventListener("click", () => flipCard(card));
        board.appendChild(card);
    });
    
    updateBestScores();
}

// Card logic
function flipCard(card) {
    if (lockBoard || card === firstCard || card.classList.contains("flipped")) return;
    
    card.classList.add("flipped");
    
    if (!firstCard) {
        firstCard = card;
        return;
    }
    
    secondCard = card;
    moves++;
    movesSpan.textContent = moves;
    
    checkMatch();
}

function checkMatch() {
    let match = firstCard.dataset.icon === secondCard.dataset.icon;
    
    if (match) {
        matches++;
        matchesSpan.textContent = matches;
        
        firstCard.removeEventListener("click", flipCard);
        secondCard.removeEventListener("click", flipCard);
        
        resetPair();
        
        let totalNeeded = level === "easy" ? 6 : 12;
        if (matches === totalNeeded) endGame();
    } else {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove("flipped");
            secondCard.classList.remove("flipped");
            resetPair();
        }, 1000);
    }
}

function resetPair() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
}

// End game
function endGame() {
    stopTimer();
    winMessage.classList.remove("hidden");
    
    let bestKey = level === "easy" ? "bestEasy" : "bestHard";
    let bestValue = localStorage.getItem(bestKey);
    
    if (!bestValue || moves < parseInt(bestValue)) {
        localStorage.setItem(bestKey, moves);
        updateBestScores();
    }
}

// Best scores
function updateBestScores() {
    bestEasy.textContent = localStorage.getItem("bestEasy") || "-";
    bestHard.textContent = localStorage.getItem("bestHard") || "-";
}

// =====================
// === CONTACT FORM ===
// =====================

function validateContactForm() {
    // Get form elements
    const firstName = document.getElementById("firstName");
    const lastName = document.getElementById("lastName");
    const email = document.getElementById("email");
    const phone = document.getElementById("phone");
    
    let isValid = true;
    
    // Clear previous errors
    document.querySelectorAll('.error-message').forEach(el => el.remove());
    document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
    document.querySelectorAll('.input-valid').forEach(el => el.classList.remove('input-valid'));
    
    // Validate each field
    if (!firstName.value.trim()) {
        showError(firstName, "Vardas yra privalomas");
        isValid = false;
    } else {
        showValid(firstName);
    }
    
    if (!lastName.value.trim()) {
        showError(lastName, "Pavardė yra privaloma");
        isValid = false;
    } else {
        showValid(lastName);
    }
    
    if (!email.value.trim()) {
        showError(email, "El. paštas yra privalomas");
        isValid = false;
    } else if (!validateEmail(email.value)) {
        showError(email, "Įveskite teisingą el. pašto adresą");
        isValid = false;
    } else {
        showValid(email);
    }
    
    if (!phone.value.trim()) {
        showError(phone, "Telefono numeris yra privalomas");
        isValid = false;
    } else if (!validatePhone(phone.value)) {
        showError(phone, "Įveskite teisingą telefono numerį");
        isValid = false;
    } else {
        showValid(phone);
    }
    
    return isValid;
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\d\s\-+()]{8,15}$/;
    return re.test(phone.replace(/\s/g, ''));
}

function showError(inputElement, message) {
    inputElement.classList.add('input-error');
    inputElement.classList.remove('input-valid');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.color = '#ff4d4d';
    errorDiv.style.fontSize = '0.85rem';
    errorDiv.style.marginTop = '5px';
    
    inputElement.parentNode.insertBefore(errorDiv, inputElement.nextSibling);
}

function showValid(inputElement) {
    inputElement.classList.add('input-valid');
    inputElement.classList.remove('input-error');
}

function showPopup(message) {
    // Remove existing popup
    const existingPopup = document.querySelector('.popup');
    if (existingPopup) existingPopup.remove();
    
    // Create new popup
    const popup = document.createElement('div');
    popup.className = 'popup show';
    popup.textContent = message;
    popup.style.position = 'fixed';
    popup.style.bottom = '30px';
    popup.style.right = '30px';
    popup.style.background = '#4caf50';
    popup.style.color = 'white';
    popup.style.padding = '15px 25px';
    popup.style.borderRadius = '8px';
    popup.style.zIndex = '1000';
    popup.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
    
    document.body.appendChild(popup);
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        popup.classList.remove('show');
        setTimeout(() => popup.remove(), 400);
    }, 5000);
}

function displayResult(data) {
    let resultBox = document.querySelector('.result-box');
    if (!resultBox) {
        resultBox = document.createElement('div');
        resultBox.className = 'result-box';
        resultBox.style.marginTop = '20px';
        resultBox.style.padding = '20px';
        resultBox.style.borderRadius = '10px';
        resultBox.style.background = '#111827';
        resultBox.style.border = '1px solid rgba(144, 180, 255, 0.2)';
        resultBox.style.color = '#fff';
        
        const form = document.getElementById('contactForm');
        form.parentNode.insertBefore(resultBox, form.nextSibling);
    }
    
    const averageRating = ((parseInt(data.rating1) + parseInt(data.rating2) + parseInt(data.rating3)) / 3).toFixed(1);
    
    const resultHtml = `
        <h3 style="color: #90b4ff; margin-bottom: 15px; border-bottom: 2px solid rgba(144, 180, 255, 0.3); padding-bottom: 10px;">Jūsų pateikta informacija:</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
            <div>
                <p><strong>Vardas:</strong> ${data.firstName}</p>
                <p><strong>Pavardė:</strong> ${data.lastName}</p>
                <p><strong>El. paštas:</strong> ${data.email}</p>
                <p><strong>Telefonas:</strong> ${data.phone}</p>
            </div>
            <div>
                <p><strong>Adresas:</strong> ${data.address || 'Nenurodytas'}</p>
                <p><strong>Vertinimas 1:</strong> ${data.rating1}/10</p>
                <p><strong>Vertinimas 2:</strong> ${data.rating2}/10</p>
                <p><strong>Vertinimas 3:</strong> ${data.rating3}/10</p>
                <p><strong>Vidutinis įvertinimas:</strong> <span style="color: #4CAF50; font-weight: bold;">${averageRating}/10</span></p>
            </div>
        </div>
        <p style="color: #90b4ff; margin-top: 15px; font-style: italic;">Ačiū už Jūsų atsiliepimą!</p>
    `;
    
    resultBox.innerHTML = resultHtml;
    resultBox.style.display = 'block';
}

// =====================
// === INITIALIZATION ===
// =====================

document.addEventListener("DOMContentLoaded", function() {
    // Initialize memory game
    updateBestScores();
    
    if (startBtn) {
        startBtn.addEventListener("click", startGame);
    }
    
    if (resetBtn) {
        resetBtn.addEventListener("click", startGame);
    }
    
    if (easyBtn && hardBtn) {
        easyBtn.addEventListener("click", () => {
            level = "easy";
            easyBtn.classList.add("active");
            hardBtn.classList.remove("active");
            startGame();
        });
        
        hardBtn.addEventListener("click", () => {
            level = "hard";
            hardBtn.classList.add("active");
            easyBtn.classList.remove("active");
            startGame();
        });
    }
    
    // Start the game initially
    startGame();
    
    // Initialize contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            if (!validateContactForm()) {
                showPopup('❌ Prašome ištaisyti klaidas formoje');
                return;
            }
            
            // Collect form data
            const formData = {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                address: document.getElementById('address') ? document.getElementById('address').value : '',
                rating1: document.getElementById('rating1').value,
                rating2: document.getElementById('rating2').value,
                rating3: document.getElementById('rating3').value
            };
            
            // Display results
            displayResult(formData);
            
            // Show success popup
            const averageRating = ((parseInt(formData.rating1) + parseInt(formData.rating2) + parseInt(formData.rating3)) / 3).toFixed(1);
            showPopup(`✅ Ačiū, ${formData.firstName}! Jūsų atsiliepimas gautas. Vidutinis įvertinimas: ${averageRating}/10`);
        });
    }
    
    // ----------------------
// ⚡ Pagalbinės funkcijos
// ----------------------

// Klaidos rodymas
function showError(input, message) {
    input.style.border = "2px solid red";

    let errorMsg = input.nextElementSibling;
    if (!errorMsg || !errorMsg.classList.contains("error-msg")) {
        errorMsg = document.createElement("div");
        errorMsg.classList.add("error-msg");
        errorMsg.style.color = "red";
        errorMsg.style.fontSize = "14px";
        errorMsg.style.marginTop = "4px";
        input.insertAdjacentElement("afterend", errorMsg);
    }
    errorMsg.textContent = message;

    validateForm();
}

// Teisingo įvedimo rodymas
function showValid(input) {
    input.style.border = "2px solid #4CAF50";

    const errorMsg = input.nextElementSibling;
    if (errorMsg && errorMsg.classList.contains("error-msg")) {
        errorMsg.remove();
    }

    validateForm();
}

// El. pašto tikrinimas
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Vardo/pavardės tikrinimas — tik raidės
function validateName(text) {
    return /^[A-Za-zĄČĘĖĮŠŲŪŽąčęėįšųūž\s-]+$/.test(text);
}

// ----------------------
// 📞 TELEFONO FORMATAVIMAS REALIU LAIKU
// ----------------------

const phoneInput = document.getElementById("phone");

phoneInput.addEventListener("input", () => {
    let value = phoneInput.value.replace(/\D/g, ""); // paliekami tik skaičiai

    // Įdedame +370 automatiškai
    if (!value.startsWith("370")) {
        value = "370" + value;
    }

    // Maksimalus ilgis: +370 6xx xxxx → realiai 11 skaičių
    value = value.substring(0, 11);

    // Formatuojame į +370 6xx xxxx
    let formatted =
        "+370 " +
        value.substring(3, 4) +
        value.substring(4, 7).replace(/^(.{0,3})/, "$1") +
        " " +
        value.substring(7, 11);

    phoneInput.value = formatted.trim();

    // Validacija
    if (value.length === 11 && value[3] === "6") {
        showValid(phoneInput);
    } else {
        showError(phoneInput, "Telefono formatas turi būti: +370 6xx xxxx");
    }
});

// Papildomas telefono tikrinimas blur metu
function validatePhone(value) {
    return /^\+370 6\d{2} \d{4}$/.test(value);
}

// ----------------------
// 🟥🟩 Realiu laiku tikrinami visi laukai
// ----------------------

const formInputs = document.querySelectorAll('#contactForm input:not([type="range"])');

formInputs.forEach(input => {
    input.addEventListener("blur", function () {

        // Vardas / Pavardė → tik raidės
        if (this.id === "firstName" || this.id === "lastName") {
            if (!validateName(this.value)) {
                showError(this, "Vardas ir pavardė gali būti sudaryti tik iš raidžių");
            } else {
                showValid(this);
            }
        }

        // El. paštas
        if (this.id === "email") {
            if (!validateEmail(this.value)) {
                showError(this, "Neteisingas el. pašto formatas");
            } else {
                showValid(this);
            }
        }

        // Adresas → visada leidžiamas, nebent tusčias
        if (this.id === "address") {
            if (this.value.trim() === "") {
                showError(this, "Adreso laukelis negali būti tuščias");
            } else {
                showValid(this);
            }
        }
    });
});

// ----------------------
// 🔒 Submit mygtuko aktyvinimas/deaktyvinimas
// ----------------------

function validateForm() {
    const submitBtn = document.getElementById("submitBtn");
    let valid = true;

    formInputs.forEach(input => {
        if (input.style.border.includes("red") || input.value.trim() === "") {
            valid = false;
        }
    });

    submitBtn.disabled = !valid;
}

validateForm();
    
    // Rating sliders value display
    const ratings = ['rating1', 'rating2', 'rating3'];
    ratings.forEach(ratingId => {
        const slider = document.getElementById(ratingId);
        if (slider) {
            const display = document.createElement('span');
            display.style.marginLeft = '10px';
            display.style.color = '#90b4ff';
            display.style.fontWeight = 'bold';
            display.textContent = slider.value;
            slider.parentNode.appendChild(display);
            
            slider.addEventListener('input', function() {
                display.textContent = this.value;
            });
        }
    });
    
    // Preloader
    const preloader = document.getElementById("preloader");
    if (preloader) {
        preloader.style.opacity = "0";
        setTimeout(() => preloader.style.display = "none", 500);
    }
});