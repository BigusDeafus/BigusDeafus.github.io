document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("contactForm");
  const resultBox = document.getElementById("formResult");
  const popup = document.getElementById("popupMessage");
  const phoneInput = document.getElementById("phone");

  // Klaidos žinutė (auto sukuriama)
  let phoneError = document.createElement("div");
  phoneError.classList.add("error-message");
  phoneInput.insertAdjacentElement("afterend", phoneError);

  // Telefonų validacija
  function validatePhone() {
    const phone = phoneInput.value.trim();

    // Reikalavimai:
    // 370 + 8 skaičiai (viso 11 simbolių)
    const phoneRegex = /^370\d{8}$/;

    if (!phoneRegex.test(phone)) {
      phoneInput.classList.add("input-error");
      phoneError.textContent = "Neteisingas numeris! Naudokite formatą: 370xxxxxxxx";
      return false;
    }

    phoneInput.classList.remove("input-error");
    phoneError.textContent = "";
    return true;
  }

  phoneInput.addEventListener("input", validatePhone);

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!validatePhone()) {
      return;
    }

    // Surenkame vertes
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.getElementById("email").value;
    const phone = phoneInput.value;

    const r1 = Number(document.getElementById("rating1").value);
    const r2 = Number(document.getElementById("rating2").value);
    const r3 = Number(document.getElementById("rating3").value);

    const avg = ((r1 + r2 + r3) / 3).toFixed(1);

    const formData = {
      vardas: firstName,
      pavarde: lastName,
      pastas: email,
      telefonas: phone,
      vidurkis: avg
    };

    console.log("Formos duomenys:", formData);

    resultBox.innerHTML = `
      <p><strong>Vardas:</strong> ${firstName}</p>
      <p><strong>Pavardė:</strong> ${lastName}</p>
      <p><strong>El. paštas:</strong> ${email}</p>
      <p><strong>Tel. numeris:</strong> ${phone}</p>
      <p><strong>Vidurkis:</strong> ${avg}</p>
    `;

    // Popup
    popup.classList.remove("hidden");
    popup.classList.add("show");

    setTimeout(() => {
      popup.classList.remove("show");
    }, 2500);
  });
});