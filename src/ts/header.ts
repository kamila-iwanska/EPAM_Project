export function initializeHeader() {
  const accountToggleEl = document.getElementById("account-toggle");
  const accountModalEl = document.getElementById("account-modal");
  const accountFormEl = document.getElementById("account-form") as HTMLFormElement | null;
  const accountEyeEl = document.getElementById("account-eye");
  const passwordInputEl = document.getElementById("password");
  if (!accountToggleEl || !accountModalEl || !accountFormEl || !accountEyeEl || !passwordInputEl) return;

  accountToggleEl.addEventListener("click", () => {
    accountModalEl.classList.remove("hidden");
  });

  accountFormEl.addEventListener("submit", (e) => {
    e.preventDefault();
    accountModalEl.classList.add("hidden");
    accountFormEl.reset();
    window.alert('Logged in successfully!');
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      accountModalEl.classList.add("hidden");
    }
  });

  accountEyeEl.addEventListener("click", () => {
    if (passwordInputEl.getAttribute("type") === "password") {
      passwordInputEl.setAttribute("type", "text");
    } else {
      passwordInputEl.setAttribute("type", "password");
    }
  });
}