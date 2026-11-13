/* =========================================================
   contact.js – Contact form validation
   Rules:
   • No field may be empty
   • Email must be in a valid format
   • Phone number must contain digits only
   ========================================================= */

const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

// Each field and the function that validates it
const fields = [
  { id: "name",    validate: validateName },
  { id: "email",   validate: validateEmail },
  { id: "phone",   validate: validatePhone },
  { id: "message", validate: validateMessage }
];

function validateName(value) {
  if (value === "") return "Name is required.";
  if (value.length < 2) return "Name must be at least 2 characters.";
  return "";
}

function validateEmail(value) {
  if (value === "") return "Email address is required.";
  const emailPattern = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
  if (!emailPattern.test(value)) return "Enter a valid email, e.g. name@example.com.";
  return "";
}

function validatePhone(value) {
  if (value === "") return "Phone number is required.";
  const digitsOnly = /^[0-9]+$/;
  if (!digitsOnly.test(value)) return "Phone number must contain digits only (no spaces, + or -).";
  if (value.length < 7 || value.length > 15) return "Phone number should be 7–15 digits long.";
  return "";
}

function validateMessage(value) {
  if (value === "") return "Message is required.";
  if (value.length < 10) return "Message should be at least 10 characters.";
  return "";
}

/* Show or clear the error for one field; returns true if valid */
function checkField(field) {
  const input = document.getElementById(field.id);
  const group = input.closest(".form-group");
  const errorEl = document.getElementById(field.id + "Error");
  const message = field.validate(input.value.trim());

  errorEl.textContent = message;
  group.classList.toggle("invalid", message !== "");
  group.classList.toggle("valid", message === "");
  input.setAttribute("aria-invalid", message !== "" ? "true" : "false");
  return message === "";
}

function showStatus(text, type) {
  formStatus.textContent = text;
  formStatus.className = "form-status show " + type;
}

/* Validate live as the user leaves each field, and re-check while typing once flagged */
fields.forEach(function (field) {
  const input = document.getElementById(field.id);
  input.addEventListener("blur", function () { checkField(field); });
  input.addEventListener("input", function () {
    if (input.closest(".form-group").classList.contains("invalid")) checkField(field);
  });
});

contactForm.addEventListener("submit", function (event) {
  event.preventDefault();

  // Validate every field (not stopping at the first error)
  const results = fields.map(checkField);
  const allValid = results.every(function (ok) { return ok; });

  if (!allValid) {
    // Shake every invalid field so the errors are easy to spot
    contactForm.querySelectorAll(".form-group.invalid").forEach(function (group) {
      group.classList.remove("shake");
      void group.offsetWidth;
      group.classList.add("shake");
    });
    showStatus("Please correct the highlighted fields and try again.", "error");
    const firstInvalid = contactForm.querySelector(".invalid input, .invalid textarea");
    if (firstInvalid) firstInvalid.focus();
    return;
  }

  const name = document.getElementById("name").value.trim();
  showStatus("Thank you, " + name + ". Your details passed every check. For the quickest reply, you can also message me on LinkedIn.", "success");
  contactForm.reset();
  contactForm.querySelectorAll(".form-group").forEach(function (g) {
    g.classList.remove("valid", "invalid");
  });
});
