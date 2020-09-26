import { elmId, activeNav, xhrRequest } from "./modules/utils.js";
document.addEventListener("DOMContentLoaded", () => {
  activeNav(window.location.pathname);
  elmId("login-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(elmId("login-form"));
    xhrRequest("POST", "/api/login", data, (err, res) => {
      if (err) {
        throw err;
      }
      if(res.success === true){
        elmId("response").classList.add("alert-success");
        setTimeout("location.href = '/'", 1000);
      }else{
        elmId("response").classList.add("alert-danger");
      }
      elmId("response").style.display = "block";
      elmId("response").innerHTML = `<span>${res.result}</span>`;
    });
  });
});
