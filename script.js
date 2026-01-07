const SHEET_ID = "1dIaBigZk4nub1NpqygIVOlrZKySHXta_D0YAt31Kn2c";
const SHEET_NAME = "Public_Directory1";

const SHEET_URL =
  `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=${encodeURIComponent(SHEET_NAME)}`;

fetch(SHEET_URL)
  .then(res => res.text())
  .then(text => {
    const json = JSON.parse(text.substring(47).slice(0, -2));

    const cols = json.table.cols.map(c => c.label.trim());
    const rows = json.table.rows;

    // Map header names to column indexes (CRITICAL FIX)
    const colIndex = {};
    cols.forEach((name, i) => colIndex[name] = i);

    const businesses = rows.map(row => {
      const get = key =>
        row.c[colIndex[key]] && row.c[colIndex[key]].v
          ? row.c[colIndex[key]].v
          : "";

      return {
        name: get("Business_Name"),
        location: get("Location"),
        type: get("Business_Type"),
        status: get("Status"),
        featured: get("Featured").toString().toUpperCase() === "YES"
      };
    });

    // 🔥 FEATURED FIRST (PIN TO TOP)
    businesses.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });

    renderBusinesses(businesses);
  })
  .catch(err => {
    console.error("Sheet load failed:", err);
    document.getElementById("directory").innerHTML =
      "<p>Failed to load directory</p>";
  });

function renderBusinesses(list) {
  const container = document.getElementById("directory");
  container.innerHTML = "";

  list.forEach(biz => {
    const card = document.createElement("div");
    card.className = "business-card";

    card.innerHTML = `
      <h2>
        ${biz.name || "Unnamed Business"}
        ${biz.featured ? '<span class="featured-badge">FEATURED</span>' : ''}
      </h2>

      <p><strong>Type:</strong> ${biz.type || "-"}</p>
      <p><strong>Location:</strong> ${biz.location || "-"}</p>
      <p><strong>Status:</strong> ${biz.status || "-"}</p>
    `;

    container.appendChild(card);
  });
}
