const blogList = document.getElementById("blog-list")


fetch('../pages/blog/blogs.json')
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json(); // Parse the JSON data
  })
  .then(data => {
    console.log(data); // The parsed JavaScript object
    for(let i = 0; i < data["blogs"].length; i++){
      let blog = data["blogs"][i]
      console.log(blog)
      blogList.innerHTML += newBlogElement(blog["name"], blog["date"])
    } //GITHUB WILL NOT UPDATE THIS FILE HOPEFULLY THIS COMMENT FORCES GITHUB TO DO IT
  })
  .catch(error => {
    console.error('Error fetching or parsing JSON:', error);
  });


function newBlogElement(name, date){
  return `<a href='https://jonkler67.gay/pages/blog/${name}.html>${name} Created On: ${date}</a>`
}
