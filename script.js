const sheetURL =
  "https://docs.google.com/spreadsheets/d/1W03edYxdlwpisKvIQNu4sXIM10EYUiFO6dmj2f9V4bo/export?format=csv&gid=0";

fetch(sheetURL)
  .then(res => res.text())
  .then(csv => {
    const rows = csv.split("\n").slice(1); // skip header
    const tbody = document.querySelector("#dataTable tbody");

    rows.forEach(row => {
      if (!row.trim()) return;
      const cols = row.split(",");

      const tr = document.createElement("tr");
      cols.forEach(col => {
        const td = document.createElement("td");
        td.textContent = col;
        tr.appendChild(td);
      });

      tbody.appendChild(tr);
    });
  })
  .catch(err => {
    console.error("Failed to load sheet", err);
  });
