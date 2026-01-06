const SHEET_ID = "1dIaBigZk4nub1NpqygIVOlrZKySHXta_D0YAt31Kn2c";
const SHEET_NAME = "Public_Directory1";

const URL = `https://opensheet.elk.sh/${SHEET_ID}/${SHEET_NAME}`;

fetch(URL)
  .then(res => res.json())
  .then(data => renderDirectory(data))
  .catch(err => {
    document.getElementById("directory").innerText = "Failed to load data";
    console.error(err);
  });

function renderDirectory(rows) {
  const container = document.getElementById("directory");
  container.innerHTML = "";

  const featured = [];
  const normal = [];

  rows.forEach(row => {
    const item = normalizeRow(row);

    if (item.featured === "YES") {
      featured.push(item);
    } else {
      normal.push(item);
    }
  });

  [...featured, ...normal].forEach(item => {
    container.appendChild(createCard(item));
  });
}

function normalizeRow(row) {
  return {
    name: row.Business_Name || "Unnamed Business",
    location: row.Location || "-",
    type: row.Business_Type || "-",
    status: row.Status || "-",
    featured: (row.Featured || "").toUpperCase()
  };
}

function createCard(item) {
  const div = document.createElement("div");
  div.className = "card" + (item.featured === "YES" ? " featured" : "");

  div.innerHTML = `
    <h2>${item.name}</h2>
    <p><strong>Type:</strong> ${item.type}</p>
    <p><strong>Location:</strong> ${item.location}</p>
    <p><strong>Status:</strong> ${item.status}</p>
    ${item.featured === "YES" ? `<span class="badge">Featured</span>` : ""}
  `;

  return div;
}
