document.addEventListener("DOMContentLoaded", function () {

    // FORM OBJECTS
    const form = document.getElementById("contactForm");
    const submitBtn = document.getElementById("submitBtn");
    const result = document.getElementById("formResult");
    const popup = document.getElementById("popupMessage");

    // INPUT FIELDS
    const fields = {
        first: document.getElementById("firstName"),
        last: document.getElementById("lastName"),
        email: document.getElementById("email"),
        phone: document.getElementById("phone"),
        address: document.getElementById("address"),
        rating1: document.getElementById("rating1"),
        rating2: document.getElementById("rating2"),
        rating3: document.getElementById("rating3")
    };

    // -------- VALIDATION RULES -------- //

    // Tik raidės
    const onlyLetters = /^[A-Za-zÀ-ž\s]+$/;

    // El. paštas
    const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Telefono formatas: 370 + 8 skaitmenys
    const phoneFormat = /^370\d{8}$/;


    // -------- VALIDATION FUNCTION -------- //

    function validateField(field) {
        let value = field.value.trim();
        let valid = true;

        // Nustatom pradines spalvas
        field.style.border = "";

        // Tikriname pagal lauką
        switch (field.id) {
            case "firstName":
            case "lastName":
                if (!onlyLetters.test(value)) valid = false;
                break;

            case "email":
                if (!emailFormat.test(value)) valid = false;
                break;

            case "address":
                if (value.length < 3) valid = false;
                break;

            case "phone":
                if (!phoneFormat.test(value)) valid = false;
                break;
        }

        // Jeigu klaida
        if (!valid) {
            field.style.border = "2px solid red";
        } else {
            field.style.border = "2px solid green";
        }

        return valid;
    }


    // -------- PHONE REAL-TIME FORMATTING -------- //

    fields.phone.addEventListener("input", function () {
        let val = fields.phone.value.replace(/\D/g, ""); // remove non-digits

        // Automatically add 370 if missing
        if (!val.startsWith("370")) {
            val = "370" + val;
        }

        // Limit length: 370 + 8 digits = 11 total
        val = val.substring(0, 11);

        fields.phone.value = val;

        // Validate phone
        validateField(fields.phone);
        checkFormValidity();
    });


    // -------- REAL-TIME VALIDATION FOR ALL INPUTS -------- //

    Object.values(fields).forEach(field => {
        if (field.type !== "range" && field.id !== "phone") {
            field.addEventListener("input", () => {
                validateField(field);
                checkFormValidity();
            });
        }
    });

    // Sliders also trigger button enabling
    ["rating1", "rating2", "rating3"].forEach(r => {
        fields[r].addEventListener("input", checkFormValidity);
    });


    // -------- CHECK IF FORM IS VALID -------- //

    function checkFormValidity() {
        const allValid =
            validateField(fields.first) &&
            validateField(fields.last) &&
            validateField(fields.email) &&
            validateField(fields.phone) &&
            validateField(fields.address);

        submitBtn.disabled = !allValid;
        return allValid;
    }

    // Initially disable submit
    submitBtn.disabled = true;


    // -------- FORM SUBMIT -------- //

    form.addEventListener("submit", function (e) {
        e.preventDefault(); // STOP PAGE REFRESH

        if (!checkFormValidity()) return;

        // Compute rating average
        const r1 = Number(fields.rating1.value);
        const r2 = Number(fields.rating2.value);
        const r3 = Number(fields.rating3.value);
        const avg = ((r1 + r2 + r3) / 3).toFixed(1);

        // Display results
        result.innerHTML = `
            <p><strong>Vardas:</strong> ${fields.first.value}</p>
            <p><strong>Pavardė:</strong> ${fields.last.value}</p>
            <p><strong>El.paštas:</strong> ${fields.email.value}</p>
            <p><strong>Telefonas:</strong> ${fields.phone.value}</p>
            <p><strong>Adresas:</strong> ${fields.address.value}</p>
            <p><strong>Įvertinimų vidurkis:</strong> ${avg}</p>
        `;

        // POPUP animation
        popup.classList.remove("hidden");
        popup.classList.add("show");

        setTimeout(() => {
            popup.classList.remove("show");
            popup.classList.add("hidden");
        }, 2500);

        console.log("Formos duomenys pateikti sėkmingai!");
    });

});

// --- Duomenų rinkinys (paveiksliukai arba emoji) ---
const icons = [
  "🍎","🍌","🍇","🍒","🥝","🍋",
  "🍓","🍑","🍍","🥭","🍈","🥥"
];


let board = [];
let flippedCards = [];
let matchedCount = 0;
let moves = 0;

// HTML elementai
const boardEl = document.getElementById("gameBoard");
const movesEl = document.getElementById("moves");
const matchesEl = document.getElementById("matches");
const winMessage = document.getElementById("winMessage");
const difficulty = document.getElementById("difficulty");

// Mygtukai
document.getElementById("startGame").addEventListener("click", startGame);
document.getElementById("resetGame").addEventListener("click", startGame);

// Funkcija: pradėti / perkurti žaidimą
function startGame() {
  winMessage.classList.add("hidden");
  moves = 0;
  matchedCount = 0;
  flippedCards = [];
  movesEl.textContent = 0;
  matchesEl.textContent = 0;

  let pairs = difficulty.value === "easy" ? 6 : 12;
  let grid = difficulty.value === "easy" ? "repeat(4, 1fr)" : "repeat(6, 1fr)";

  boardEl.style.gridTemplateColumns = grid;

  let selectedIcons = icons.slice(0, pairs);
  board = [...selectedIcons, ...selectedIcons]
    .sort(() => Math.random() - 0.5);

  boardEl.innerHTML = "";

  board.forEach((icon, index) => {
    let card = document.createElement("div");
    card.classList.add("card");
    card.dataset.index = index;
    card.dataset.value = icon;
    card.textContent = icon;

    card.addEventListener("click", flipCard);
    boardEl.appendChild(card);
  });
}

// Funkcija: apversti kortelę
function flipCard() {
  if (flippedCards.length === 2) return;

  let card = this;
  if (card.classList.contains("flipped") || card.classList.contains("matched")) return;

  card.classList.add("flipped");
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    moves++;
    movesEl.textContent = moves;

    setTimeout(checkMatch, 600);
  }
}

// Funkcija: tikrinti ar kortelės sutampa
function checkMatch() {
  let [c1, c2] = flippedCards;

  if (c1.dataset.value === c2.dataset.value) {
    c1.classList.add("matched");
    c2.classList.add("matched");
    matchedCount++;
    matchesEl.textContent = matchedCount;
  } else {
    c1.classList.remove("flipped");
    c2.classList.remove("flipped");
  }

  flippedCards = [];

  if (matchedCount === board.length / 2) {
    winMessage.classList.remove("hidden");
  }
}