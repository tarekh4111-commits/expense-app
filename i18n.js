const translations = {
  bn: {
    app_title: "আয় ও খরচের হিসাব",
    monthly_summary: "মাসিক আয় ও খরচের হিসাব",
    income: "আয়",
    add_income: "আয় যোগ করুন",
    total_income: "মোট আয়: ৳ ",
    expense: "খরচ",
    add_expense: "খরচ যোগ করুন",
    total_expense: "মোট খরচ: ৳ ",
    current_balance: "বর্তমান ব্যালেন্স: ৳ ",
    end_month: "মাস শেষ করুন",
    view_history: "বিগত মাসসমূহ",
    history: "বিগত মাসের হিসাব"
  },
  en: {
    app_title: "Income & Expense Tracker",
    monthly_summary: "Monthly Income and Expense Summary",
    income: "Income",
    add_income: "Add Income",
    total_income: "Total Income: ৳ ",
    expense: "Expense",
    add_expense: "Add Expense",
    total_expense: "Total Expense: ৳ ",
    current_balance: "Current Balance: ৳ ",
    end_month: "End Month",
    view_history: "View History",
    history: "History"
  },
  ar: {
    app_title: "تتبع الدخل والمصروفات",
    monthly_summary: "ملخص الدخل والمصروفات الشهرية",
    income: "الدخل",
    add_income: "إضافة دخل",
    total_income: "إجمالي الدخل: ৳ ",
    expense: "المصروفات",
    add_expense: "إضافة مصروف",
    total_expense: "إجمالي المصروفات: ৳ ",
    current_balance: "الرصيد الحالي: ৳ ",
    end_month: "إنهاء الشهر",
    view_history: "عرض السجل",
    history: "السجل"
  }
};

function translate(lang) {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    el.innerText = translations[lang][el.dataset.i18n];
  });

  document.querySelectorAll("[data-placeholder-i18n]").forEach(el => {
    el.placeholder = translations[lang][el.dataset.placeholderI18n];
  });
}

const savedLang = localStorage.getItem("lang") || "bn";
document.getElementById("language-select").value = savedLang;
translate(savedLang);

document.getElementById("language-select").addEventListener("change", e => {
  localStorage.setItem("lang", e.target.value);
  translate(e.target.value);
});