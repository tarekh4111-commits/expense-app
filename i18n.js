const translations = {
  bn: { income: "আয়", add_income: "যোগ করুন", total_income: "মোট আয়: ", expense: "খরচ", add_expense: " যোগ করুন", total_expense: "মোট খরচ: ", current_balance: "ব্যালেন্স: ", end_month: "হিসাব সংরক্ষণ করুন", view_history: "পূর্বের মাস সমূহের হিসাব", history: "পুরনো রেকর্ড", language: "ভাষা:", calendar: "ক্যালেন্ডার:" },
  en: { income: "Income", add_income: "Add Income", total_income: "Total Income: ", expense: "Expense", add_expense: "Add Expense", total_expense: "Total Expense: ", current_balance: "Balance: ", end_month: "End Month", view_history: "History", history: "Past Records", language: "Language:", calendar: "Calendar:" }
};

function translate(lang) {
  if (lang === 'ar' || !translations[lang]) lang = 'bn';
  localStorage.setItem("lang", lang);
  document.querySelectorAll("[data-i18n]").forEach(el => { el.innerText = translations[lang][el.dataset.i18n]; });
  document.querySelectorAll("[data-placeholder-i18n]").forEach(el => { el.placeholder = translations[lang][el.dataset.placeholderI18n]; });
  if (typeof updateDisplay === "function") updateDisplay();
}

const savedLang = localStorage.getItem("lang") || "bn";
document.getElementById("language-select").value = savedLang === 'ar' ? 'bn' : savedLang;
translate(document.getElementById("language-select").value);
document.getElementById("language-select").onchange = (e) => translate(e.target.value);
