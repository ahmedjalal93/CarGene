import { elmId, xhrRequest } from "./modules/utils.js";
document.addEventListener("DOMContentLoaded", () => {
  const queryString = window.location.href;
  const id = queryString.split("/")[4];
  const token = queryString.split("/")[5];
  elmId("reset-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(elmId("reset-form"));
    data.append("id", id);
    data.append("token", token);
    xhrRequest("PUT", "/api/reset", data, (err, res) => {
      if (err) {
        throw err;
      }
      if (res.success === true) {
        elmId("response").classList.add("alert-success");
        setTimeout("location.href = '/'", 1000);
      } else {
        elmId("response").classList.add("alert-danger");
      }
      elmId("response").style.display = "block";
      elmId("response").innerHTML = `<span>${res.result}</span>`;
      elmId("response").style.display = "block";
    });
  });
});
