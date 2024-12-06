// src/script/script.js

const PASSWORD_HASH =
  "65cf631ed56a8af60fcce2129510145518bd50fa1407c1543a5be37bae6a6c4f";

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function handleLogin(event) {
  event.preventDefault();
  const inputPassword = document.getElementById("password").value;
  const inputHash = await hashPassword(inputPassword);

  if (inputHash === PASSWORD_HASH) {
    const currentTime = Date.now();
    localStorage.setItem("authenticated", "true");
    localStorage.setItem("authTime", currentTime);
    window.location.href = "../../index.html";
  } else {
    alert("Incorrect password. Please try again.");
  }
}

function checkAuthentication() {
  const isAuthenticated = localStorage.getItem("authenticated") === "true";
  const authTime = parseInt(localStorage.getItem("authTime"), 10);
  const sessionDuration = 2 * 60 * 60 * 1000;

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

function refreshSession() {
  if (localStorage.getItem("authenticated") === "true") {
    localStorage.setItem("authTime", Date.now());
  }
}

document.addEventListener("mousemove", refreshSession);
document.addEventListener("keydown", refreshSession);

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }
});

let faqs = [];

fetch("../database/all_faq.json")
  .then((response) => response.json())
  .then((data) => {
    faqs = data.map((faq) => ({
      Question: faq.Question.trim(),
      Response: faq.Response.trim(),
      Keywords: faq.Keywords.map((keyword) => keyword.toLowerCase().trim()),
    }));
    console.log("Normalized FAQs:", faqs);
  })
  .catch((error) => console.error("Error loading FAQs:", error));

const searchBar = document.getElementById("search-bar");
const resultsContainer = document.getElementById("results");

searchBar.addEventListener("input", () => {
  const query = searchBar.value.toLowerCase().trim();
  resultsContainer.innerHTML = "";

  const queryWords = query.split(/\s+/);

  const filteredFaqs = faqs.filter((faq) => {
    const questionText = faq.Question.toLowerCase();
    const responseText = faq.Response.toLowerCase();
    const keywordText = faq.Keywords.join(" ");

    return queryWords.every(
      (word) =>
        questionText.includes(word) ||
        responseText.includes(word) ||
        keywordText.includes(word)
    );
  });

  if (filteredFaqs.length === 0 && query.length > 0) {
    const noResults = document.createElement("p");
    noResults.textContent = "No matching FAQs found.";
    noResults.style.color = "#d08770";
    resultsContainer.appendChild(noResults);
    return;
  }

  filteredFaqs.forEach((faq) => {
    const resultItem = document.createElement("div");
    resultItem.className = "result-item";

    const question = document.createElement("h2");
    question.textContent = faq.Question;

    const response = document.createElement("p");
    response.textContent = faq.Response;

    resultItem.appendChild(question);
    resultItem.appendChild(response);
    resultsContainer.appendChild(resultItem);
  });
});

const hamburger = document.getElementById("hamburger");
const navlinks = document.getElementById("navlinks");

hamburger.addEventListener("click", () => {
  navlinks.classList.toggle("show");
});
