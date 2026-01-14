let currentIncomeData = JSON.parse(localStorage.getItem("currentIncomeData")) || [];
let currentExpenseData = JSON.parse(localStorage.getItem("currentExpenseData")) || [];
let historyData = JSON.parse(localStorage.getItem("monthlyHistory")) || [];
let currentCalendar = localStorage.getItem("calendarType") || "gregory";
let myChart = null;

function formatCurrency(num) {
    const lang = localStorage.getItem("lang") || "bn";
    return new Intl.NumberFormat(lang === 'bn' ? 'bn-BD' : 'en-US', { style: 'currency', currency: 'BDT' }).format(num);
}

function updateDisplay() {
    const lang = localStorage.getItem("lang") || "bn";
    const today = new Date();
    const displayEl = document.getElementById("currentMonthDisplay");

    if (currentCalendar === "islamic-ummalqura") {
        const locale = (lang === 'bn') ? 'bn-BD' : 'en-US';
        const parts = new Intl.DateTimeFormat(locale + '-u-ca-islamic-umalqura', {day:'numeric', month:'long', year:'numeric'}).formatToParts(today);
        const d = parts.find(p => p.type === 'day').value;
        const m = parts.find(p => p.type === 'month').value;
        const y = parts.find(p => p.type === 'year').value;
        displayEl.textContent = lang === "bn" ? `${d} ${m} ${y} হিজরি` : `${d} ${m} ${y} AH`;
    } else {
        displayEl.textContent = new Intl.DateTimeFormat(lang === 'bn' ? 'bn-BD' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' }).format(today);
    }

    renderList("income", currentIncomeData, "incomeList");
    renderList("expense", currentExpenseData, "expenseList");

    const totalIn = currentIncomeData.reduce((s, i) => s + i.amount, 0);
    const totalEx = currentExpenseData.reduce((s, i) => s + i.amount, 0);

    document.getElementById("totalIncome").textContent = formatCurrency(totalIn);
    document.getElementById("totalExpense").textContent = formatCurrency(totalEx);
    document.getElementById("balance").textContent = formatCurrency(totalIn - totalEx);
    calculateStats();
}

function renderList(type, data, elementId) {
    document.getElementById(elementId).innerHTML = data.map((item, idx) => `
        <li><span>${item.title}: <strong>${formatCurrency(item.amount)}</strong></span>
        <div class="action-btns"><button onclick="editEntry('${type}', ${idx})" class="edit-btn">✎</button>
        <button onclick="deleteEntry('${type}', ${idx})" class="delete-btn">🗑️</button></div></li>`).join("");
}

function addEntry(type) {
    const t = document.getElementById(type + "Title"), a = document.getElementById(type + "Amount");
    const v = parseFloat(a.value);
    if (!t.value || isNaN(v)) return;
    const data = type === "income" ? currentIncomeData : currentExpenseData;
    data.push({ title: t.value, amount: v, date: new Date().toISOString().split('T')[0] });
    saveAndRefresh();
    t.value = ""; a.value = "";
}

function calculateStats() {
    const todayStr = new Date().toISOString().split('T')[0];
    const daily = currentExpenseData.filter(i => i.date === todayStr).reduce((s, i) => s + i.amount, 0);
    const monthly = currentExpenseData.reduce((s, i) => s + i.amount, 0);
    const yearly = historyData.reduce((s, i) => s + i.expense, 0) + monthly;

    if(document.getElementById("dailyStat")) document.getElementById("dailyStat").textContent = formatCurrency(daily);
    if(document.getElementById("monthlyStat")) document.getElementById("monthlyStat").textContent = formatCurrency(monthly);
    if(document.getElementById("yearlyStat")) document.getElementById("yearlyStat").textContent = formatCurrency(yearly);
}

function showChart(title, labels, data, type) {
    document.getElementById("chartContainer").style.display = "block";
    document.getElementById("chartTitle").textContent = title;
    if (myChart) myChart.destroy();
    const ctx = document.getElementById('expenseChart').getContext('2d');
    myChart = new Chart(ctx, {
        type: type,
        data: { labels: labels, datasets: [{ label: 'খরচ', data: data, backgroundColor: 'rgba(15, 157, 88, 0.5)', borderColor: '#0f9d58', borderWidth: 2 }] }
    });
}

document.getElementById("monthlyStatBtn").onclick = () => {
    const dailyData = {};
    currentExpenseData.forEach(i => dailyData[i.date] = (dailyData[i.date] || 0) + i.amount);
    showChart("দৈনিক খরচ বিশ্লেষণ", Object.keys(dailyData), Object.values(dailyData), 'bar');
};

document.getElementById("yearlyStatBtn").onclick = () => {
    const monthlyData = {};
    historyData.forEach(i => monthlyData[i.month] = i.expense);
    showChart("মাসিক খরচ বিশ্লেষণ", Object.keys(monthlyData), Object.values(monthlyData), 'line');
};

function saveAndRefresh() {
    localStorage.setItem("currentIncomeData", JSON.stringify(currentIncomeData));
    localStorage.setItem("currentExpenseData", JSON.stringify(currentExpenseData));
    updateDisplay();
}

function editEntry(type, idx) {
    const data = type === "income" ? currentIncomeData : currentExpenseData;
    const nt = prompt("নাম সংশোধন:", data[idx].title), na = prompt("পরিমাণ সংশোধন:", data[idx].amount);
    if(nt && na) { data[idx].title = nt; data[idx].amount = parseFloat(na); saveAndRefresh(); }
}

function deleteEntry(type, idx) {
    if(confirm("ডিলিট করবেন?")) { (type === "income" ? currentIncomeData : currentExpenseData).splice(idx, 1); saveAndRefresh(); }
}

const dmToggle = document.getElementById("darkModeToggle");
function applyDM(isDark) {
    document.body.classList.toggle("dark-mode", isDark);
    localStorage.setItem("darkMode", isDark);
    if(dmToggle) dmToggle.checked = isDark;
}
applyDM(localStorage.getItem("darkMode") === "true");
if(dmToggle) dmToggle.onchange = (e) => applyDM(e.target.checked);

document.getElementById("toggleHistoryBtn").onclick = () => {
    const h = document.getElementById("history");
    h.style.display = h.style.display === "none" ? "block" : "none";
    updateHistoryUI();
};

function updateHistoryUI() {
    document.getElementById("historyList").innerHTML = historyData.map((i, idx) => `
        <li><span><strong>${i.month}</strong><br>আয়: ${formatCurrency(i.income)} | খরচ: ${formatCurrency(i.expense)}</span>
        <div class="action-btns"><button onclick="deleteHistory(${idx})" class="delete-btn">🗑️</button></div></li>`).join("");
}

function deleteHistory(idx) { if(confirm("মুছবেন?")) { historyData.splice(idx,1); localStorage.setItem("monthlyHistory", JSON.stringify(historyData)); updateHistoryUI(); calculateStats(); } }

document.getElementById("endMonthBtn").onclick = () => {
    if(confirm("মাস ক্লোজ করবেন?")) {
        historyData.push({ month: document.getElementById("currentMonthDisplay").textContent, income: currentIncomeData.reduce((s,i)=>s+i.amount,0), expense: currentExpenseData.reduce((s,i)=>s+i.amount,0) });
        localStorage.setItem("monthlyHistory", JSON.stringify(historyData));
        currentIncomeData = []; currentExpenseData = [];
        saveAndRefresh();
    }
};

document.getElementById("addIncomeBtn").onclick = () => addEntry("income");
document.getElementById("addExpenseBtn").onclick = () => addEntry("expense");
document.getElementById("language-select").onchange = (e) => { localStorage.setItem("lang", e.target.value); location.reload(); };
document.getElementById("calendar-select").onchange = (e) => { currentCalendar = e.target.value; localStorage.setItem("calendarType", currentCalendar); updateDisplay(); };

updateDisplay();
