function urlencodeFormData(fd) {
  let s = "";
  function encode(s) {
    return encodeURIComponent(s).replace(/%20/g, "+");
  }
  for (const pair of fd.entries()) {
    if (typeof pair[1] === "string") {
      s += (s ? "&" : "") + encode(pair[0]) + "=" + encode(pair[1]);
    }
  }
  return s;
}

function elmId(id){
  return document.getElementById(id);
}

function activeNav(path){
  document.querySelector("a[href='"+path+"']").parentElement.classList.add("active");
}

function xhrRequest(method, url, data, done){
  const xhr = new XMLHttpRequest();
  xhr.open(method, url);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.onload = function () {
    let res = JSON.parse(this.response);
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      done(null, {success: true, result: res });
    }else{
      done(null, {success: false, result: res });
    }
  };

  xhr.onerror = function () {
    done(this.response)
  };

  xhr.send(urlencodeFormData(data));
}

export { urlencodeFormData, elmId, activeNav, xhrRequest }