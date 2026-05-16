// CLIENTS MODULE

document.addEventListener("DOMContentLoaded", () => {

  initClients();
  loadClients();
  bindForm();
  bindSearch();

});


// DATA

let clients = JSON.parse(localStorage.getItem("clients")) || [];


// INIT (API LOAD ON FIRST TIME)

async function initClients() {

  // If already exists → skip API
  if (clients.length > 0) return;

  try {

    const res = await fetch("https://randomuser.me/api/?results=5&nat=us");
    const data = await res.json();

    clients = data.results.map(user => ({
      id: Date.now() + Math.random(),
      name: `${user.name.first} ${user.name.last}`,
      email: user.email,
      company: "Freelance Inc.",
      notes: "Auto-generated client"
    }));

    saveClients();
    loadClients();

  } catch (error) {
    console.log("API Error:", error);
  }
}

// SAVE TO LOCALSTORAGE

function saveClients() {
  localStorage.setItem("clients", JSON.stringify(clients));
}


// RENDER CLIENTS

function loadClients(list = clients) {

  const tbody = document.getElementById("clientTableBody");
  const count = document.getElementById("clientCount");

  if (!tbody) return;

  tbody.innerHTML = "";

  list.forEach(client => {

    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${client.name}</td>
      <td>${client.email}</td>
      <td>${client.company || "-"}</td>
      <td>${client.notes || "-"}</td>
      <td>
        <button class="action-btn edit-btn" onclick="editClient(${client.id})">Edit</button>
        <button class="action-btn delete-btn" onclick="deleteClient(${client.id})">Delete</button>
      </td>
    `;

    tbody.appendChild(row);

  });

  // update stats
  if (count) {
    count.textContent = clients.length;
  }
}


// ADD CLIENT

function bindForm() {

  const form = document.getElementById("clientForm");

  if (!form) return;

  form.addEventListener("submit", (e) => {

    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const company = document.getElementById("company").value.trim();
    const notes = document.getElementById("notes").value.trim();

    if (!name || !email) {
      alert("Name and Email are required!");
      return;
    }

    const newClient = {
      id: Date.now(),
      name,
      email,
      company,
      notes
    };

    clients.push(newClient);

    saveClients();
    loadClients();

    form.reset();

  });

}

// DELETE CLIENT

function deleteClient(id) {

  clients = clients.filter(client => client.id !== id);

  saveClients();
  loadClients();

}

// EDIT CLIENT

function editClient(id) {

  const client = clients.find(c => c.id === id);
  if (!client) return;

  const newName = prompt("Edit Name:", client.name);
  const newEmail = prompt("Edit Email:", client.email);
  const newCompany = prompt("Edit Company:", client.company);
  const newNotes = prompt("Edit Notes:", client.notes);

  if (newName && newEmail) {

    client.name = newName;
    client.email = newEmail;
    client.company = newCompany;
    client.notes = newNotes;

    saveClients();
    loadClients();

  }

}


// SEARCH

function bindSearch() {

  const search = document.getElementById("searchInput");

  if (!search) return;

  search.addEventListener("input", (e) => {

    const value = e.target.value.toLowerCase();

    const filtered = clients.filter(client =>
      client.name.toLowerCase().includes(value) ||
      client.email.toLowerCase().includes(value) ||
      (client.company || "").toLowerCase().includes(value)
    );

    loadClients(filtered);

  });

}