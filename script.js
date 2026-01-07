const SHEET_ID = "1dIaBigZk4nub1NpqygIVOlrZKySHXta_D0YAt31Kn2c";
const SHEET_NAME = "Public_Directory1";

const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=${SHEET_NAME}`;

fetch(SHEET_URL)
  .then(res => res.text())
  .then(text => {
    const json = JSON.parse(text.substring(47).slice(0, -2));
    const rows = json.table.rows;

    const container = document.getElementById("directory");
    container.innerHTML = "";

    rows.forEach(row => {
      const name = row.c[0]?.v || "Unnamed Business";
      const location = row.c[1]?.v || "-";        // ✅ FIXED
      const type = row.c[2]?.v || "-";
      const status = row.c[3]?.v || "-";
      const featured = row.c[4]?.v || "No";

      const card = document.createElement("div");
      card.className = "business-card";

      card.innerHTML = `
        <h2>${name}</h2>
        <p><strong>Type:</strong> ${type}</p>
        <p><strong>Location:</strong> ${location}</p>
        <p><strong>Status:</strong> ${status}</p>
      `;

      if (featured.toLowerCase() === "yes") {
        card.classList.add("featured");
      }

      container.appendChild(card);
    });
  })
  .catch(err => {
    document.getElementById("directory").innerHTML =
      "<p>Failed to load directory.</p>";
    console.error(err);
  });
