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

  if (!isAuthenticated || !authTime || Date.now() - authTime > sessionDuration) {
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
      errorMessage.textContent = "Incorrect password. Please try again.";
      errorMessage.style.display = "block";
    }
  } catch (error) {
    console.error("Error during login:", error);
    errorMessage.textContent = "An unexpected error occurred. Please try again.";
    errorMessage.style.display = "block";
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
  const errorMessage = document.createElement("div");
  errorMessage.id = "errorMessage";
  errorMessage.style.color = "red";
  errorMessage.style.display = "none";
  loginForm.insertAdjacentElement("beforeend", errorMessage);

  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }
});

document.addEventListener("mousemove", refreshSession);
document.addEventListener("keydown", refreshSession);


// ===========================
//  Modal Logic
// ===========================

window.onload = function () {
  const modal = document.getElementById("modal");
  const modalContent = document.querySelector(".modal-content");
  const closeButton = document.getElementById("close");

  // Show the modal with animation
  modal.style.display = "flex";
  setTimeout(() => {
    modal.classList.add("show");
  }, 100); // Add delay to trigger the animation

  // Close the modal when the close button is clicked
  closeButton.onclick = function () {
    modal.classList.remove("show"); // Reverse the animation
    setTimeout(() => {
      modal.style.display = "none";
    }, 500); // Wait for the animation to complete
  };

  // Optional: Close the modal when clicking outside of it
  window.onclick = function (event) {
    if (event.target === modal) {
      modal.classList.remove("show");
      setTimeout(() => {
        modal.style.display = "none";
      }, 500); // Wait for the animation to complete
    }
  };
};

// ===========================
//  Navbar Hamburger Menu Logic
// ===========================

/**
 * Handles the open/close behavior of the hamburger menu.
 */
document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const navlinks = document.getElementById("navlinks");
  const navbar = document.getElementById("navbar");

  // Toggles the menu state
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navlinks.classList.toggle("show");
  });

  // Closes the menu when clicking outside the navbar
  document.addEventListener("click", (e) => {
    if (!navbar.contains(e.target) && navlinks.classList.contains("show")) {
      navlinks.classList.remove("show");
      hamburger.classList.remove("active");
    }
  });
});

// =====================
//  FAQ Search Logic
// =====================

/**
 * Fetches FAQs from the JSON file and normalizes the data.
 */
let faqs = [];
fetch("../database/all_faq.json")
  .then((response) => response.json())
  .then((data) => {
    faqs = data.map((faq) => ({
      Question: faq.Question.trim(),
      Response: faq.Response.trim(),
      Keywords: faq.Keywords.map((keyword) => keyword.toLowerCase().trim()),
    }));
  })
  .catch((error) => console.error("Error loading FAQs:", error));

/**
 * Filters and displays FAQs based on the user's search query.
 */
const searchBar = document.getElementById("search-bar");
const resultsContainer = document.getElementById("results");

searchBar.addEventListener("input", () => {
  const query = searchBar.value.toLowerCase().trim();
  resultsContainer.innerHTML = "";

  const queryWords = query.split(/\s+/);
  const filteredFaqs = faqs.filter((faq) => {
    const combinedText = `${faq.Question} ${faq.Response} ${faq.Keywords.join(
      " "
    )}`.toLowerCase();
    return queryWords.every((word) => combinedText.includes(word));
  });

  if (!filteredFaqs.length && query.length > 0) {
    resultsContainer.innerHTML = `<p style="color: #d08770;">No matching FAQs found.</p>`;
    return;
  }

  filteredFaqs.forEach((faq) => {
    const resultItem = document.createElement("div");
    resultItem.className = "result-item";
    resultItem.innerHTML = `<h2>${faq.Question}</h2><p>${faq.Response}</p>`;
    resultsContainer.appendChild(resultItem);
  });
});
