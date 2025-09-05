const form = document.getElementById("passwordForm")

form.addEventListener("submit", function(e) {
  e.preventDefault();
  const data = new FormData(form);
  for (const [name,value] of data) {
    if(name == "password" && value == "12345679"){
        location.href = "/pages/supersecret.html"
    }
  }
})

