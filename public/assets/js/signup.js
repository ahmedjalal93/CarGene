import { elmId, activeNav, xhrRequest } from "./modules/utils.js";
document.addEventListener("DOMContentLoaded", () => {
  activeNav(window.location.pathname);
  elmId("signup-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(elmId("signup-form"));

    xhrRequest("POST", "/api/signup", data, (err, res) => {
      if (err) {
        throw err;
      }
      if(res.success === true){
        elmId("response").classList.add("alert-success");
        elmId("response").innerHTML = `<span>${res.result}</span>`;
      }else{
        elmId("response").classList.add("alert-danger");
        if (res.result.length > 0) {
          elmId("response").innerHTML = "";
          for (const i in res.result) {
            elmId("response").insertAdjacentHTML("beforeend", `<span>${res.result[i]}</span><br/>`);
          }
        } else {
          console.log("Error", res);
        }
      }
      console.log("res", res, " err", err);
      elmId("response").style.display = "block";
    });
  });
});
