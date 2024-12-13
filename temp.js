// =====================
//  Authentication Logic
// =====================

// Add the missing PASSWORD_HASH
const PASSWORD_HASH =
  "65cf631ed56a8af60fcce2129510145518bd50fa1407c1543a5be37bae6a6c4f";

/**
 * Verifies if the user is authenticated and redirects to the login page if not.
 */
function checkAuthentication() {
  const isAuthenticated = localStorage.getItem("authenticated") === "true";
  const authTime = parseInt(localStorage.getItem("authTime"), 10);
  const sessionDuration = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

  if (
    !isAuthenticated ||
    !authTime ||
    Date.now() - authTime > sessionDuration
  ) {
    localStorage.removeItem("authenticated");
    localStorage.removeItem("authTime");
    window.location.href = "../pages/form.html";
  }
}

/**
 * Refreshes the session timestamp on user interaction.
 */
function refreshSession() {
  if (localStorage.getItem("authenticated") === "true") {
    localStorage.setItem("authTime", Date.now());
  }
}

/**
 * Handles user login by verifying the password and storing session data.
 */
async function handleLogin(event) {
  event.preventDefault();

  const inputPassword = document.getElementById("password").value;
  const errorMessage = document.getElementById("errorMessage");

  try {
    const inputHash = await hashPassword(inputPassword);

    if (inputHash === PASSWORD_HASH) {
      localStorage.setItem("authenticated", "true");
      localStorage.setItem("authTime", Date.now());
      window.location.href = "../../index.html"; // Redirect to the main page
    } else {
      displayError("Incorrect password. Please try again.");
    }
  } catch (error) {
    console.error("Error during login:", error);
    displayError("An unexpected error occurred. Please try again.");
  }
}

/**
 * Hashes the password using SHA-256.
 */
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// =====================
//  Event Listeners
// =====================

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");

  // Add error message container if it doesn't exist
  const errorMessage = document.getElementById("errorMessage");
  errorMessage.id = "errorMessage";
  loginForm.insertAdjacentElement("beforeend", errorMessage);
});

if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const inputPassword = document.getElementById("password").value;

    try {
      const inputHash = await hashPassword(inputPassword);

      if (inputHash === PASSWORD_HASH) {
        localStorage.setItem("authenticated", "true");
        localStorage.setItem("authTime", Date.now());
        window.location.href = "../../index.html"; // Redirect to the main page
      } else {
        displayError("Incorrect password. Please try again.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      displayError("An unexpected error occurred. Please try again.");
    }
  });
}

/**
 * Displays an error message and fades it out after 15 seconds.
 */
function displayError(message) {
  errorMessage.textContent = message;
  errorMessage.style.display = "block";

  // Clear any previous timeout to avoid conflicts
  clearTimeout(errorMessage.fadeTimeout);

  // Set a timeout to fade out the message
  errorMessage.fadeTimeout = setTimeout(() => {
    fadeOut(errorMessage);
  }, 15000);
}

/**
 * Fades out an element smoothly.
 */
function fadeOut(element) {
  let opacity = 1; // Start fully visible
  element.style.opacity = opacity; // Ensure opacity is reset
  const fadeInterval = setInterval(() => {
    if (opacity <= 0) {
      clearInterval(fadeInterval);
      element.style.display = "none"; // Fully hide the element
    } else {
      opacity -= 0.05;
      element.style.opacity = opacity;
    }
  });
}

document.addEventListener("mousemove", refreshSession);
document.addEventListener("keydown", refreshSession);
