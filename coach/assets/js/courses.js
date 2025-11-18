document.addEventListener("DOMContentLoaded", () => {
  enforceAuthForBodyRole(); // can be disabled in dev mode

  const tableBody = document.getElementById("courses-table-body");
  const cardContainer = document.getElementById("courses-cards");
  const searchInput = document.getElementById("course-search");

  // MOCK DATA — replace with API later
  let courses = [
    {
      id: "c1",
      title: "High Ticket Sales Mastery",
      status: "published",
      students: 42,
      updated: "2 days ago",
    },
    {
      id: "c2",
      title: "Closing Objections 101",
      status: "draft",
      students: 12,
      updated: "1 week ago",
    },
    {
      id: "c3",
      title: "DM Closing System",
      status: "published",
      students: 31,
      updated: "4 days ago",
    }
  ];

  function render() {
    const query = searchInput.value.toLowerCase();

    const filtered = courses.filter(c =>
      c.title.toLowerCase().includes(query)
    );

    renderTable(filtered);
    renderCards(filtered);
  }

  function renderTable(list) {
    tableBody.innerHTML = "";

    list.forEach(course => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>
          <span class="course-title">${course.title}</span>
        </td>

        <td>
          <span class="status-badge ${
            course.status === "published"
              ? "status-published"
              : "status-draft"
          }">
            ${course.status}
          </span>
        </td>

        <td>${course.students}</td>

        <td>${course.updated}</td>

        <td>
          <button class="row-action-btn">Manage</button>
        </td>
      `;

      tableBody.appendChild(tr);
    });
  }

  function renderCards(list) {
    cardContainer.innerHTML = "";

    list.forEach(course => {
      const div = document.createElement("div");
      div.className = "course-card";

      div.innerHTML = `
        <div class="course-card-title">${course.title}</div>
        <div class="course-card-meta">
          ${course.students} students • ${course.updated}
        </div>

        <span class="status-badge ${
          course.status === "published"
            ? "status-published"
            : "status-draft"
        }">${course.status}</span>

        <div class="course-card-actions">
          <button class="card-btn">Manage</button>
        </div>
      `;

      cardContainer.appendChild(div);
    });
  }

  searchInput.addEventListener("input", render);

  render();
});
