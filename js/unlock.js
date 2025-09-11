const form = document.getElementById("passwordForm")

form.addEventListener("submit", function(e) {
  e.preventDefault();
  const data = new FormData(form);
  for (const [name,value] of data) {
    if(name == "password" && btoa(value) == 'Zm9ydG5pdGU='){
        location.href = "/pages/supersecret.html"
    }
  }
})

