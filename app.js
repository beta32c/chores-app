let kid1Points = 0;
let kid2Points = 0;

document.getElementById("kid1-form").addEventListener("submit", (e) => addTask(e, "kid1"));
document.getElementById("kid2-form").addEventListener("submit", (e) => addTask(e, "kid2"));

function switchTab(tabName) {
  document.querySelectorAll(".tab-content").forEach((tab) => (tab.style.display = "none"));
  document.getElementById(tabName).style.display = "block";
  document.querySelectorAll(".tabs button").forEach((btn) => btn.classList.remove("active"));
  document.getElementById(tabName === "Kid1" ? "tab1" : "tab2").classList.add("active");
}

function addTask(e, kid) {
  e.preventDefault();
  const input = document.getElementById(`${kid}-input`);
  const taskPoints = document.getElementById(`${kid}-task-points`);
  const list = document.getElementById(`${kid}-list`);
  const pointsDiv = document.getElementById(`${kid}-points`);
  const task = input.value.trim();
  const points = parseInt(taskPoints.value);

  if (!task || points <= 0) return;

  const item = document.createElement("li");
  item.innerHTML = `${task} - ${points} Points <button onclick="markTaskDone(this, '${kid}', ${points})">✔</button>`;
  list.appendChild(item);

  input.value = "";
  taskPoints.value = "";
  updatePoints(kid, points);
}

function markTaskDone(button, kid, points) {
  button.parentElement.remove();
  updatePoints(kid, -points);
}

function updatePoints(kid, points) {
  if (kid === "kid1") {
    kid1Points += points;
    document.getElementById("kid1-points").textContent = `Points: ${kid1Points}`;
  } else {
    kid2Points += points;
    document.getElementById("kid2-points").textContent = `Points: ${kid2Points}`;
  }
  updateLeaderboard();
}

function updateLeaderboard() {
  const leaderboard = document.getElementById("ranking");
  leaderboard.innerHTML = `
    <p>${kid1Points >= kid2Points ? "Kid-1" : "Kid-2"} is in the lead!</p>
    <p>Kid-1: ${kid1Points} points</p>
    <p>Kid-2: ${kid2Points} points</p>
  `;
}

// Initialize Leaderboard
updateLeaderboard();
