import { initializeState } from "./state.js";
import { initializeHeader } from "./header.js";
function initializeContactView() {
    const formEl = document.getElementById('contact-form');
    formEl.addEventListener('submit', (e) => {
        e.preventDefault();
        formEl.reset();
        window.alert('Thank you for your feedback. We will contact you soon!');
    });
}
initializeState();
initializeHeader();
initializeContactView();
