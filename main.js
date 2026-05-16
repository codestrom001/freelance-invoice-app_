// THEME SYSTEM (ALL PAGES)


document.addEventListener("DOMContentLoaded", () => {

  initTheme();
  loadDashboard();
  loadQuote();

});

// THEME

function initTheme() {

  const themeToggle = document.getElementById("themeToggle");

  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "light") {
    document.body.classList.add("light");
  }

  updateIcon();

  if (!themeToggle) return;

  themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("light");

    localStorage.setItem(
      "theme",
      document.body.classList.contains("light") ? "light" : "dark"
    );

    updateIcon();
  });

  function updateIcon() {
    const btn = document.getElementById("themeToggle");
    if (!btn) return;

    btn.innerHTML = document.body.classList.contains("light")
      ? `<i class="fa-solid fa-sun"></i>`
      : `<i class="fa-solid fa-moon"></i>`;
  }
}

// DASHBOARD STATS

function loadDashboard() {

  let clients = JSON.parse(localStorage.getItem("clients")) || [];
  let invoices = JSON.parse(localStorage.getItem("invoices")) || [];

  // Total Clients
  const totalClientsEl = document.getElementById("totalClients");
  if (totalClientsEl) {
    totalClientsEl.textContent = clients.length;
  }

  // Total Invoices
  const totalInvoicesEl = document.getElementById("totalInvoices");
  if (totalInvoicesEl) {
    totalInvoicesEl.textContent = invoices.length;
  }

  // Total Revenue
  const revenue = invoices.reduce((sum, inv) => {
    return sum + Number(inv.amount || 0);
  }, 0);

  const totalRevenueEl = document.getElementById("totalRevenue");
  if (totalRevenueEl) {
    totalRevenueEl.textContent = "$" + revenue;
  }

  // Paid invoices
  const paidCount = invoices.filter(inv => inv.status === "paid").length;

  const paidInvoicesEl = document.getElementById("paidInvoices");
  if (paidInvoicesEl) {
    paidInvoicesEl.textContent = paidCount;
  }

  // Progress bars (safe)
  const paidBar = document.querySelector(".paid-progress");
  const unpaidBar = document.querySelector(".unpaid-progress");

  if (invoices.length > 0 && paidBar && unpaidBar) {

    const paidPercent = (paidCount / invoices.length) * 100;

    paidBar.style.width = paidPercent + "%";
    unpaidBar.style.width = (100 - paidPercent) + "%";

  } else if (paidBar && unpaidBar) {

    paidBar.style.width = "0%";
    unpaidBar.style.width = "0%";
  }
}

// ZEN QUOTES API

async function loadQuote() {

  const quoteText = document.getElementById("quoteText");
  const quoteAuthor = document.getElementById("quoteAuthor");

  if (!quoteText || !quoteAuthor) return;

  try {

    const res = await fetch("https://zenquotes.io/api/quotes");
    const data = await res.json();

    const quote = data[0];

    quoteText.textContent = `"${quote.q}"`;
    quoteAuthor.textContent = "— " + (quote.a || "Unknown");

  } catch (error) {

    quoteText.textContent = "Keep building. Success comes step by step.";
    quoteAuthor.textContent = "— System";

  }
}