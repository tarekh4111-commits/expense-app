let totalIncome = 0;
let totalExpense = 0;

const incomeList = document.getElementById("incomeList");
const expenseList = document.getElementById("expenseList");
const totalIncomeSpan = document.getElementById("totalIncome");
const totalExpenseSpan = document.getElementById("totalExpense");
const balanceSpan = document.getElementById("balance");
const historyList = document.getElementById("historyList");
const historyDiv = document.getElementById("history");

const incomeTitle = document.getElementById("incomeTitle");
const incomeAmount = document.getElementById("incomeAmount");
const expenseTitle = document.getElementById("expenseTitle");
const expenseAmount = document.getElementById("expenseAmount");

let currentIncomeData = JSON.parse(localStorage.getItem("currentIncomeData")) || [];
let currentExpenseData = JSON.parse(localStorage.getItem("currentExpenseData")) || [];
let historyData = JSON.parse(localStorage.getItem("monthlyHistory")) || [];

/* ===== বাংলা সংখ্যা ফরম্যাট (২০২৬ আপডেট অনুযায়ী) ===== */
function toBn(num) {
  return num.toString().replace(/\d/g, d => "০১২৩৪৫৬৭৮৯"[d]);
}

/* ===== হিসাব আপডেট ===== */
function calculateTotals() {
  totalIncome = currentIncomeData.reduce((sum, item) => sum + Number(item.amount), 0);
  totalExpense = currentExpenseData.reduce((sum, item) => sum + Number(item.amount), 0);

  totalIncomeSpan.textContent = toBn(totalIncome);
  totalExpenseSpan.textContent = toBn(totalExpense);
  balanceSpan.textContent = toBn(totalIncome - totalExpense);
}

/* ===== মাসিক ডাটা লোড ===== */
function loadMonth() {
  incomeList.innerHTML = "";
  expenseList.innerHTML = "";

  currentIncomeData.forEach(item => {
    const li = document.createElement("li");
    // এখানে ব্যাকটিক (`) ব্যবহার করা হয়েছে
    li.textContent = `${item.title} - ৳${toBn(item.amount)}`;
    incomeList.appendChild(li);
  });

  currentExpenseData.forEach(item => {
    const li = document.createElement("li");
    // এখানে ব্যাকটিক (`) ব্যবহার করা হয়েছে
    li.textContent = `${item.title} - ৳${toBn(item.amount)}`;
    expenseList.appendChild(li);
  });

  calculateTotals();
}

/* ===== আয়/খরচ যোগ ===== */
function addEntry(type) {
  const titleInput = type === "income" ? incomeTitle : expenseTitle;
  const amountInput = type === "income" ? incomeAmount : expenseAmount;
  const data = type === "income" ? currentIncomeData : currentExpenseData;

  if (!titleInput.value || Number(amountInput.value) <= 0) {
    alert("দয়া করে সঠিক নাম এবং ০ এর বেশি টাকা লিখুন");
    return;
  }

  data.push({ title: titleInput.value, amount: Number(amountInput.value) });
  
  localStorage.setItem(
    type === "income" ? "currentIncomeData" : "currentExpenseData",
    JSON.stringify(data)
  );

  titleInput.value = "";
  amountInput.value = "";

  loadMonth();
}

document.getElementById("addIncomeBtn").onclick = () => addEntry("income");
document.getElementById("addExpenseBtn").onclick = () => addEntry("expense");

/* ===== মাস শেষ (২০২৬ সালের ডাটা সেভ হবে) ===== */
function endMonth() {
  if (currentIncomeData.length === 0 && currentExpenseData.length === 0) {
    alert("সেভ করার মতো কোনো ডাটা নেই!");
    return;
  }

  historyData.push({
    month: new Date().toLocaleString("bn-BD", { month: "long", year: "numeric" }),
    income: totalIncome,
    expense: totalExpense,
    balance: totalIncome - totalExpense
  });

  localStorage.setItem("monthlyHistory", JSON.stringify(historyData));
  localStorage.removeItem("currentIncomeData");
  localStorage.removeItem("currentExpenseData");

  currentIncomeData = [];
  currentExpenseData = [];

  loadMonth();
  alert("এই মাসের হিসাব সংরক্ষণ হয়েছে ✅");
}

document.getElementById("endMonthBtn").onclick = endMonth;

/* ===== হিস্টোরি দেখানো ===== */
function renderHistory() {
  historyList.innerHTML = "";
  [...historyData].reverse().forEach(item => {
    const li = document.createElement("li");
    // এখানে ব্যাকটিক (`) ব্যবহার করা হয়েছে
    li.textContent = `${item.month} | আয়: ৳${toBn(item.income)} | খরচ: ৳${toBn(item.expense)} | ব্যালেন্স: ৳${toBn(item.balance)}`;
    historyList.appendChild(li);
  });
}

document.getElementById("toggleHistoryBtn").onclick = () => {
  if (historyDiv.style.display === "none" || historyDiv.style.display === "") {
    historyDiv.style.display = "block";
    renderHistory();
  } else {
    historyDiv.style.display = "none";
  }
};

/* ===== প্রথমে লোড হবে জানুয়ারি ২০২৬-এর জন্য ===== */
loadMonth();