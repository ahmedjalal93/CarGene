import { activeNav } from "./modules/utils.js";
document.addEventListener("DOMContentLoaded", () => {
  activeNav(window.location.pathname);
});
