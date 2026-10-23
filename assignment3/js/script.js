// PixelForge - JavaScript for Assignment 4

// ===== Task 1: Form validation (contact.html) =====
// These static-site demos never send or persist form values.
function emailError(input) {
  const value = input.value.trim();
  if (!value) return "Please enter your email address.";

  // Use the browser's email rules and require a complete, dotted domain.
  const parts = value.split("@");
  const domain = parts[1] || "";
  const labels = domain.split(".");
  const validDomain = labels.length > 1 && labels.every(function (label) {
    return /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i.test(label);
  });
  if (input.validity.typeMismatch || value.length > 254 || /\s/.test(value) ||
      parts.length !== 2 || parts[0].length > 64 || parts[0].startsWith(".") ||
      parts[0].endsWith(".") || parts[0].includes("..") || !validDomain) {
    return "Enter a valid email address, such as name@example.com.";
  }
  return "";
}

function setFieldError(field, text) {
  field.error.textContent = text;
  field.input.setAttribute("aria-invalid", text ? "true" : "false");
  field.input.classList.toggle("is-invalid", Boolean(text));
}

function setupDemoForm(form, fields, message, successText, onSuccess) {
  let attempted = false;

  function clearFeedback() {
    attempted = false;
    fields.forEach(function (field) { setFieldError(field, ""); });
    message.textContent = "";
    message.classList.remove("success", "error");
  }

  function validate() {
    let firstInvalid = null;
    fields.forEach(function (field) {
      const error = field.input.disabled ? "" : field.validate(field.input);
      setFieldError(field, error);
      if (error && !firstInvalid) firstInvalid = field.input;
    });
    return firstInvalid;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    attempted = true;
    fields.forEach(function (field) {
      if (field.trim) field.input.value = field.input.value.trim();
    });
    const firstInvalid = validate();
    message.classList.toggle("error", Boolean(firstInvalid));
    message.classList.toggle("success", !firstInvalid);
    if (firstInvalid) {
      message.textContent = "Please correct the highlighted fields.";
      firstInvalid.focus();
    } else {
      message.textContent = successText;
      attempted = false;
      if (onSuccess) onSuccess();
    }
  });

  function refreshFeedback() {
    message.textContent = "";
    message.classList.remove("success", "error");
    if (attempted) validate();
  }
  form.addEventListener("input", refreshFeedback);
  form.addEventListener("change", refreshFeedback);
  form.querySelectorAll('button[type="submit"]').forEach(function (button) { button.disabled = false; });
  return { clearFeedback: clearFeedback };
}

function formField(inputId, errorId, validate, trim) {
  return {
    input: document.getElementById(inputId),
    error: document.getElementById(errorId),
    validate: validate,
    trim: Boolean(trim)
  };
}

function nameError(input) {
  return input.value.trim() ? "" : "Please enter your full name.";
}

const regForm = document.getElementById("registration-form");
if (regForm) {
  const password = document.getElementById("reg-password");
  const confirmation = document.getElementById("reg-confirm");
  setupDemoForm(regForm, [
    formField("reg-name", "name-error", nameError, true),
    formField("reg-email", "email-error", emailError, true),
    formField("reg-password", "password-error", function (input) {
      return input.value.trim() && input.value.length >= 8 ? "" : "Use a password with at least 8 characters.";
    }),
    formField("reg-confirm", "confirm-error", function (input) {
      if (!input.value) return "Please confirm your password.";
      return input.value === password.value ? "" : "Passwords do not match.";
    })
  ], document.getElementById("registration-message"),
  "Your details passed validation. Demo only: no account was created and no data was sent or saved.",
  function () {
    password.value = "";
    confirmation.value = "";
  });
}

const contactForm = document.getElementById("contact-form");
if (contactForm) {
  const phone = document.getElementById("phoneInput");
  const phoneField = document.getElementById("phone-field");
  const phoneChoice = document.getElementById("radioPhone");
  function updateContactMethod() {
    phoneField.hidden = !phoneChoice.checked;
    phone.disabled = !phoneChoice.checked;
    phone.required = phoneChoice.checked;
    if (phone.disabled) {
      phone.classList.remove("is-invalid");
      phone.setAttribute("aria-invalid", "false");
      document.getElementById("contact-phone-error").textContent = "";
    }
  }
  contactForm.querySelectorAll('[name="contactMethod"]').forEach(function (choice) {
    choice.addEventListener("change", updateContactMethod);
  });
  updateContactMethod();
  setupDemoForm(contactForm, [
    formField("nameInput", "contact-name-error", nameError, true),
    formField("emailInput", "contact-email-error", emailError, true),
    formField("contact-reason", "contact-reason-error", function (input) {
      return input.value ? "" : "Please choose a reason for contact.";
    }),
    formField("phoneInput", "contact-phone-error", function (input) {
      const digits = input.value.replace(/\D/g, "");
      return /^[+\d\s().-]+$/.test(input.value) && digits.length >= 7 && digits.length <= 15 ? "" :
        "Enter a phone number with 7 to 15 digits.";
    }, true),
    formField("messageTextarea", "contact-message-error", function (input) {
      return input.value.trim() ? "" : "Please enter your message.";
    }, true)
  ], document.getElementById("contact-message"),
  "Your message passed validation. Demo only: no message was sent and no newsletter subscription was created.");
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

if (popup && openPopupBtn && closePopupBtn) {
  const popupEmail = document.getElementById("popup-email");
  const dialog = document.getElementById("newsletter-dialog");
  const newsletterForm = setupDemoForm(document.getElementById("popup-form"), [
    formField("popup-email", "popup-email-error", emailError, true)
  ], document.getElementById("popup-message"),
  "Your email address passed validation. Demo only: you have not been subscribed, and no email was sent or saved.");
  let previousFocus = null;
  let previousOverflow = "";
  const backgroundState = new Map();

  function closePopup() {
    if (popup.hidden) return;
    popup.classList.remove("show");
    popup.hidden = true;
    openPopupBtn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = previousOverflow;
    backgroundState.forEach(function (wasInert, element) { element.inert = wasInert; });
    backgroundState.clear();
    if (previousFocus && previousFocus.isConnected) previousFocus.focus();
  }

  openPopupBtn.addEventListener("click", function () {
    previousFocus = document.activeElement;
    previousOverflow = document.body.style.overflow;
    newsletterForm.clearFeedback();
    popup.hidden = false;
    popup.classList.add("show");
    openPopupBtn.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    Array.from(document.body.children).forEach(function (element) {
      if (element !== popup && element.tagName !== "SCRIPT") {
        backgroundState.set(element, element.inert);
        element.inert = true;
      }
    });
    popupEmail.focus();
  });

  closePopupBtn.addEventListener("click", closePopup);

  // click on the dark area outside the box closes the popup
  popup.addEventListener("click", function (event) {
    if (event.target === popup) {
      closePopup();
    }
  });

  // Keep keyboard focus inside the dialog, then return it to the opener.
  document.addEventListener("keydown", function (event) {
    if (popup.hidden) return;
    if (event.key === "Escape") {
      event.preventDefault();
      closePopup();
    } else if (event.key === "Tab") {
      const focusable = Array.from(dialog.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )).filter(function (element) { return !element.disabled && element.getClientRects().length; });
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first) {
        event.preventDefault();
        dialog.focus();
      } else if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || document.activeElement === dialog)) {
        event.preventDefault();
        first.focus();
      }
    }
  });
  openPopupBtn.disabled = false;
}


// ===== Task 4: Change background color (index.html) =====
const colorBtn = document.getElementById("change-color");

if (colorBtn) {
  const colors = [
    { name: "Midnight", value: "#0f0f1a" },
    { name: "Deep purple", value: "#171129" },
    { name: "Navy", value: "#101b30" },
    { name: "Forest", value: "#10231f" }
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
