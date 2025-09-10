let navbar = []
let pages = [
  {
    name: "Physics C",
    id: "physics-c",
    short: true,
    link: "/pages/physics-c.html",
  },
  {
    name: "Blog",
    id:"blog",
    short: true,
    link:"/pages/blog.html"
  },
  {
    name: "Unlock",
    id:"unlock",
    short:true,
    link:"/pages/unlock.html"
  },
  {
    name:"Clanker Page"
    id:"ai",
    short:false,
    link:"https://ai.jonkler67.gay"
  }
]

class NavButton(){
  constructor(name, id, short, link, parent){
    this.name = name
    this.id = id
    this.short = short
    this.link = link
    this.parent = parent
    generateHTML()
    generateNavigation()
  }

  generateHTML(){
    this.html = document.createElement("button")
    this.html.innerHTML = `<button class="title-cell title-button" id="${this.id}">${this.name}</button>`
    this.parrent.appendChild(this.html)
  }

  generateNavigation(){
    this.html.addEventListener("click", () => {
      if(this.short){
        location.href = this.link
      }else{
        window.location.assign(this.link)
      }
    }
  }
}

function generateNavbar(){
  for(page in pages){
    navbar.push(new NavButton(page.name, page.id, page.short, page.link, document.getElementById("navbar")))
  }
}
generateNavbar()
