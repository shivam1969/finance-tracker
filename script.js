let list = document.getElementById("list");
let balance = document.getElementById("balance");
let filter = document.getElementById("filter");

let transactions = JSON.parse(localStorage.getItem("transactions") || "[]");

let popup = document.getElementById("popup");
let addBtn = document.getElementById("addBtn");
let closeBtn = document.getElementById("close");
let saveBtn = document.getElementById("save");

addBtn.onclick = () => popup.style.display = "flex";
closeBtn.onclick = () => popup.style.display = "none";

function updateUI() {
    list.innerHTML = "";
    let total = 0;

    transactions.forEach((t, index) => {
        if (filter.value !== "all" && filter.value !== t.type) return;

        let li = document.createElement("li");
        li.innerHTML = `
            <span>${t.desc} (${t.type})</span>
            <span>₹${t.amount}</span>
        `;
        list.appendChild(li);

        total += t.type === "income" ? t.amount : -t.amount;
    });

    balance.innerText = "₹" + total;
    drawChart();
}

saveBtn.onclick = () => {
    let desc = document.getElementById("desc").value;
    let amount = parseFloat(document.getElementById("amount").value);
    let type = document.getElementById("type").value;

    if (!desc || !amount) return;

    transactions.push({ desc, amount, type });
    localStorage.setItem("transactions", JSON.stringify(transactions));

    popup.style.display = "none";
    updateUI();
};

filter.onchange = updateUI;

// Chart.js Setup
let ctx = document.getElementById("chart");
let chart;

function drawChart() {
    let income = transactions
        .filter(t => t.type === "income")
        .reduce((a,b) => a + b.amount, 0);

    let expense = transactions
        .filter(t => t.type === "expense")
        .reduce((a,b) => a + b.amount, 0);

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ["Income", "Expense"],
            datasets: [{
                data: [income, expense]
            }]
        }
    });
}

// Theme Toggle
document.getElementById("themeToggle").onclick = () => {
    document.body.classList.toggle("dark");
};

updateUI();
