let navButtons = document.getElementsByClassName("title-button");

console.log(navButtons)
for (let i = 0; i < navButtons.length; i++) {
    navButtons[i].addEventListener('click', () => {
        let newLocation = "/pages/" + navButtons[i].id + ".html";
        if (navButtons[i].id == "index") {
            location.href = "/"
        } else if(navButtons[i].id == "ai"){
                window.location.assign('https://www.example.com/new-page.html');
        } else if (newLocation != "/pages/.html") {
            location.href = newLocation
        }

    })
}





