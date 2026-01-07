const SHEET_ID = "1dIaBigZk4nub1NpqygIVOlrZKySHXta_D0YAt31Kn2c";
const SHEET_NAME = "Public_Directory1";

const URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(SHEET_NAME)}`;

fetch(URL)
  .then(res => res.text())
  .then(text => {
    const json = JSON.parse(text.substring(47).slice(0, -2));
    const cols = json.table.cols.map(c =>
      c.label.trim().toLowerCase()
    );
    const rows = json.table.rows.map(r =>
      r.c.map(c => (c ? c.v : ""))
    );

    const index = name =>
      cols.findIndex(c => c.replace(/\s+/g, "_") === name);

    const idxName = index("business_name");
    const idxLocation = index("location");
    const idxType = index("business_type");
    const idxStatus = index("status");
    const idxFeatured = index("featured");

    const data = rows.map(r => ({
      name: r[idxName] || "Unnamed Business",
      location: r[idxLocation] || "-",
      type: r[idxType] || "-",
      status: r[idxStatus] || "-",
      featured: (r[idxFeatured] || "").toString().toLowerCase() === "yes"
    }));

    data.sort((a, b) => b.featured - a.featured);

    render(data);
  })
  .catch(err => {
    document.getElementById("directory").innerHTML =
      "<p>Failed loading directory.</p>";
    console.error(err);
  });

function render(list) {
  const container = document.getElementById("directory");
  container.innerHTML = "";

  list.forEach(b => {
    const card = document.createElement("div");
    card.className = "card" + (b.featured ? " featured" : "");

    card.innerHTML = `
      <h2>${b.name}</h2>
      <p><strong>Type:</strong> ${b.type}</p>
      <p><strong>Location:</strong> ${b.location}</p>
      <p><strong>Status:</strong> ${b.status}</p>
      ${b.featured ? `<span class="badge">Featured</span>` : ""}
    `;

    container.appendChild(card);
  });
}
