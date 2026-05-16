// INVOICES MODULE

document.addEventListener("DOMContentLoaded", () => {

  loadClientsToDropdown();
  loadInvoices();
  bindInvoiceForm();

});

// DATA

let invoices = JSON.parse(localStorage.getItem("invoices")) || [];
let clients = JSON.parse(localStorage.getItem("clients")) || [];

// SAVE

function saveInvoices() {
  localStorage.setItem("invoices", JSON.stringify(invoices));
}

// LOAD CLIENTS INTO DROPDOWN

function loadClientsToDropdown() {

  const select = document.getElementById("clientSelect");

  if (!select) return;

  select.innerHTML = `<option value="">Choose Client</option>`;

  clients.forEach(client => {

    const option = document.createElement("option");
    option.value = client.id;
    option.textContent = client.name;

    select.appendChild(option);

  });
}

// CREATE INVOICE

function bindInvoiceForm() {

  const form = document.getElementById("invoiceForm");

  if (!form) return;

  form.addEventListener("submit", (e) => {

    e.preventDefault();

    const clientId = document.getElementById("clientSelect").value;
    const title = document.getElementById("serviceTitle").value.trim();
    const amount = document.getElementById("amount").value;
    const date = document.getElementById("invoiceDate").value;
    const description = document.getElementById("description").value.trim();

    if (!clientId || !title || !amount || !date) {
      alert("Please fill all required fields!");
      return;
    }

    const client = clients.find(c => c.id == clientId);

    const newInvoice = {
      id: Date.now(),
      clientId,
      clientName: client ? client.name : "Unknown",
      title,
      amount: Number(amount),
      date,
      description,
      status: "unpaid"
    };

    invoices.push(newInvoice);

    saveInvoices();
    loadInvoices();

    form.reset();

  });

}

// LOAD INVOICES

function loadInvoices(list = invoices) {

  const tbody = document.getElementById("invoiceTableBody");

  if (!tbody) return;

  tbody.innerHTML = "";

  list.forEach(inv => {

    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${inv.clientName}</td>
      <td>${inv.title}</td>
      <td>$${inv.amount}</td>

      <td>
        <span class="status ${inv.status}">
          ${inv.status}
        </span>
      </td>

      <td>${inv.date}</td>

      <td>
        <button class="action-btn edit-btn" onclick="toggleStatus(${inv.id})">
          Toggle
        </button>

        <button class="action-btn delete-btn" onclick="deleteInvoice(${inv.id})">
          Delete
        </button>
      </td>
    `;

    tbody.appendChild(row);

  });

  updateStats();

}

// TOGGLE PAID / UNPAID

function toggleStatus(id) {

  const invoice = invoices.find(inv => inv.id === id);

  if (!invoice) return;

  invoice.status = invoice.status === "paid" ? "unpaid" : "paid";

  saveInvoices();
  loadInvoices();

}

// DELETE INVOICE

function deleteInvoice(id) {

  invoices = invoices.filter(inv => inv.id !== id);

  saveInvoices();
  loadInvoices();

}

// STATS (DASHBOARD STYLE)

function updateStats() {

  const total = document.getElementById("invoiceCount");
  const paidCount = document.getElementById("paidCount");
  const unpaidCount = document.getElementById("unpaidCount");
  const totalMoney = document.getElementById("totalMoney");

  if (total) total.textContent = invoices.length;

  const paid = invoices.filter(inv => inv.status === "paid").length;
  const unpaid = invoices.filter(inv => inv.status === "unpaid").length;

  const revenue = invoices.reduce((sum, inv) => sum + inv.amount, 0);

  if (paidCount) paidCount.textContent = paid;
  if (unpaidCount) unpaidCount.textContent = unpaid;
  if (totalMoney) totalMoney.textContent = "$" + revenue;

}