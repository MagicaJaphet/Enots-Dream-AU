function getBaseUrl(url) {
    var result = url.hostname;
    if (result.search("github") != -1 && url.href.search("Enots-Dream-AU") == -1) {
        result += "Enots-Dream-AU";
    }
    return result + url.href.splice(url.hostname.length + 3);
}

function fixURLs() {
  var z, i, elmnt, file;
  /* Loop through a collection of all HTML elements: */
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    /*search for elements with a certain atrribute:*/
    file = elmnt.getAttribute("href");
    if (file && file[0] == ".") {
      z[i].href = getBaseUrl(file);
    }
  }
}

/* Code from W3Schools*/
function includeHTML() {
  var z, i, elmnt, file, xhttp;
  /* Loop through a collection of all HTML elements: */
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    /*search for elements with a certain atrribute:*/
    file = elmnt.getAttribute("w3-include-html");
    if (file) {
      /* Make an HTTP request using the attribute value as the file name: */
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
          if (this.status == 200) {elmnt.innerHTML = this.responseText;}
          if (this.status == 404) {elmnt.innerHTML = "Page not found.";}
          /* Remove the attribute, and call this function once more: */
          elmnt.removeAttribute("w3-include-html");
          includeHTML();
        }
      }
      xhttp.open("GET", file, false);
      xhttp.send();
      /* Exit the function: */
      fixURLs();
      return;
    }
  }
}

includeHTML();