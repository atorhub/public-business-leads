// ================================
// CONFIG
// ================================
const SHEET_ID = "1dIaBigZk4nub1NpqygIVOlrZKySHXta_D0YAt31Kn2c";
const SHEET_NAME = "Public_Directory1";

const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=${encodeURIComponent(
  SHEET_NAME
)}&tq=${encodeURIComponent("SELECT *")}`;

// ================================
// HELPERS
// ================================
function normalizeHeader(header) {
  return header
    .toLowerCase()
    .replace(/\s+/g, "_")
    .trim();
}

function parseSheetData(data) {
  if (!data || data.length < 2) return [];

  const headers = data[0].map(normalizeHeader);

  return data.slice(1).map(row => {
    const obj = {};
    headers.forEach((key, index) => {
      obj[key] = row[index] || "";
    });
    return obj;
  });
}

// ================================
// FETCH + RENDER
// ================================
function loadBusinesses() {
  fetch(SHEET_URL)
    .then(res => res.text())
    .then(text => {
      const json = JSON.parse(text.substring(47).slice(0, -2));
      const rows = json.table.rows.map(r =>
        r.c.map(c => (c ? c.v : ""))
      );

      const parsedData = parseSheetData(rows);

      console.log("Parsed business data:", parsedData); // DEBUG

      renderBusinesses(parsedData);
    })
    .catch(err => {
      console.error("Failed loading sheet:", err);
      document.getElementById("directory").innerHTML =
        "<p>Failed loading directory.</p>";
    });
}

// ================================
// UI RENDER
// ================================
function renderBusinesses(data) {
  const container = document.getElementById("directory");
  container.innerHTML = "";

  if (!data.length) {
    container.innerHTML = "<p>No businesses found.</p>";
    return;
  }

  // Featured first
  data.sort((a, b) => {
    if (a.featured === "Yes" && b.featured !== "Yes") return -1;
    if (a.featured !== "Yes" && b.featured === "Yes") return 1;
    return 0;
  });

  data.forEach(item => {
    const card = document.createElement("div");
    card.className = "business-card";

    card.innerHTML = `
      <h2>
        ${item.business_name || "Unnamed Business"}
        ${
          item.featured === "Yes"
            ? `<span class="badge">Featured</span>`
            : ""
        }
      </h2>
      <p><strong>Type:</strong> ${item.business_type || "-"}</p>
      <p><strong>Location:</strong> ${item.location || "-"}</p>
      <p><strong>Status:</strong> ${item.status || "-"}</p>
    `;

    container.appendChild(card);
  });
}

// ================================
// INIT
// ================================
document.addEventListener("DOMContentLoaded", loadBusinesses);
