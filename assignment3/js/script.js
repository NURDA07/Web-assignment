// PixelForge - JavaScript for Assignment 4

// ===== Task 1: Form validation (contact.html) =====
const regForm = document.getElementById("registration-form");

if (regForm) {
  regForm.addEventListener("submit", function (event) {
    event.preventDefault(); // stop the page from reloading

    const name = document.getElementById("reg-name").value.trim();
    const email = document.getElementById("reg-email").value.trim();
    const password = document.getElementById("reg-password").value;
    const confirm = document.getElementById("reg-confirm").value;

    let isValid = true;

    // name
    if (name === "") {
      document.getElementById("name-error").textContent = "Please enter your name.";
      isValid = false;
    } else {
      document.getElementById("name-error").textContent = "";
    }

    // email
    if (email === "") {
      document.getElementById("email-error").textContent = "Please enter your email.";
      isValid = false;
    } else if (email.indexOf("@") === -1 || email.indexOf(".") === -1) {
      document.getElementById("email-error").textContent = "Email must look like name@example.com";
      isValid = false;
    } else {
      document.getElementById("email-error").textContent = "";
    }

    // password
    if (password.length < 8) {
      document.getElementById("password-error").textContent = "Password must be at least 8 characters.";
      isValid = false;
    } else {
      document.getElementById("password-error").textContent = "";
    }

    // confirm password
    if (confirm !== password || confirm === "") {
      document.getElementById("confirm-error").textContent = "Passwords do not match.";
      isValid = false;
    } else {
      document.getElementById("confirm-error").textContent = "";
    }

    // result message
    const message = document.getElementById("registration-message");
    if (isValid) {
      message.textContent = "Success! The form is valid (nothing was sent).";
      message.className = "success";
    } else {
      message.textContent = "Please fix the errors above.";
      message.className = "error";
    }
  });
}


// ===== Task 2: FAQ accordion (about.html) =====
const questions = document.querySelectorAll(".faq-question");

for (let i = 0; i < questions.length; i++) {
  questions[i].addEventListener("click", function () {
    const answer = this.nextElementSibling; // the answer is right after the button
    const wasOpen = answer.classList.contains("open");

    // close all answers first
    const allAnswers = document.querySelectorAll(".faq-answer");
    for (let j = 0; j < allAnswers.length; j++) {
      allAnswers[j].classList.remove("open");
    }

    // open this one (if it was closed before)
    if (!wasOpen) {
      answer.classList.add("open");
    }
  });
}


// ===== Task 3: Popup subscription form (index.html) =====
const popup = document.getElementById("popup");
const openPopupBtn = document.getElementById("open-popup");
const closePopupBtn = document.getElementById("close-popup");

if (popup) {
  openPopupBtn.addEventListener("click", function () {
    popup.classList.add("show");
  });

  closePopupBtn.addEventListener("click", function () {
    popup.classList.remove("show");
  });

  // click on the dark area outside the box closes the popup
  popup.addEventListener("click", function (event) {
    if (event.target === popup) {
      popup.classList.remove("show");
    }
  });

  // Escape key closes the popup
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      popup.classList.remove("show");
    }
  });

  // subscribe form
  document.getElementById("popup-form").addEventListener("submit", function (event) {
    event.preventDefault();
    const email = document.getElementById("popup-email").value.trim();
    const text = document.getElementById("popup-message");

    if (email.indexOf("@") === -1 || email.indexOf(".") === -1) {
      text.textContent = "Please enter a valid email.";
      text.className = "error";
    } else {
      text.textContent = "Thanks for subscribing!";
      text.className = "success";
    }
  });
}


// ===== Task 4: Change background color (index.html) =====
const colorBtn = document.getElementById("change-color");

if (colorBtn) {
  const colors = [
    { name: "Light", value: "#f8f9fa" },
    { name: "Ice blue", value: "#dbeafe" },
    { name: "Lavender", value: "#ede9fe" },
    { name: "Mint", value: "#d1fae5" }
  ];
  let colorIndex = 0;

  colorBtn.addEventListener("click", function () {
    colorIndex = colorIndex + 1;
    if (colorIndex === colors.length) {
      colorIndex = 0; // go back to the first color
    }
    document.body.style.backgroundColor = colors[colorIndex].value;
    document.getElementById("color-text").textContent = "Background color: " + colors[colorIndex].name;
  });
}


// ===== Task 5: Current date and time (index.html) =====
const clock = document.getElementById("clock");

if (clock) {
  function showTime() {
    const now = new Date();
    clock.textContent = now.toLocaleString();
  }

  showTime();                  // show right away
  setInterval(showTime, 1000); // then update every second
}
