const blogList = document.getElementById("blog-list")


fetch('path/to/your/file.json')
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
      blogList.innerHTML += newBlogElement(blog["name"], blog["date"])
  })
  .catch(error => {
    console.error('Error fetching or parsing JSON:', error);
  });


function newBlogElement(name, date){
  return `<a href='https://jonkler67.gay/pages/blog/${name}.html>${name} Created On: ${date}</a>`
}
