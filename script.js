const SHEET_ID = "1dIaBigZk4nub1NpqygIVOlrZKySHXta_D0YAt31Kn2c";
const SHEET_NAME = "Public_Directory1";

const URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=${encodeURIComponent(SHEET_NAME)}`;

fetch(URL)
  .then(res => res.text())
  .then(text => {
    const json = JSON.parse(text.substring(47).slice(0, -2));

    const rows = json.table.rows;

    // 🧠 FIRST ROW = HEADERS (MANUAL, RELIABLE)
    const headers = rows[0].c.map(c => c?.v?.toString().trim());

    const index = {};
    headers.forEach((h, i) => index[h] = i);

    // DATA STARTS FROM ROW 2
    const businesses = rows.slice(1).map(r => {
      const get = key =>
        r.c[index[key]] && r.c[index[key]].v
          ? r.c[index[key]].v
          : "";

      return {
        name: get("Business_Name"),
        location: get("Location"),
        type: get("Business_Type"),
        status: get("Status"),
        featured: get("Featured").toUpperCase() === "YES"
      };
    });

    // ⭐ FEATURED FIRST
    businesses.sort((a, b) => b.featured - a.featured);

    render(businesses);
  })
  .catch(err => {
    console.error(err);
    document.getElementById("directory").innerHTML =
      "<p>Failed to load directory</p>";
  });

function render(list) {
  const el = document.getElementById("directory");
  el.innerHTML = "";

  list.forEach(b => {
    el.innerHTML += `
      <div class="business-card">
        <h2>
          ${b.name || "Unnamed Business"}
          ${b.featured ? '<span class="featured-badge">FEATURED</span>' : ''}
        </h2>
        <p><strong>Type:</strong> ${b.type || "-"}</p>
        <p><strong>Location:</strong> ${b.location || "-"}</p>
        <p><strong>Status:</strong> ${b.status || "-"}</p>
      </div>
    `;
  });
}
