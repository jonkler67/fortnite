const blogList = document.getElementById("blog-list")


fetch('/pages/blog/blogs.json')
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json(); // Parse the JSON data
  })
  .then(data => {
    console.log(data); // The parsed JavaScript object
    let latestBlog;
    let latestBlogDate = "1/1/1";
    for (let i = 0; i < data["blogs"].length; i++) {
      let blog = data["blogs"][i]
      console.log(blog)
      blogList.innerHTML += newBlogElement(blog["name"], blog["date"])
      if (latestBlogDate == null || new Date(latestBlogDate).getTime() < new Date(blog["date"]).getTime()) {
        latestBlog = blog["name"]
        latestBlogDate = blog["date"]
      }
    }
    let link = document.createElement('a')
    link.style = "font-size: 3vh; background-color:black; width: 33%; margin: 0 auto;"
    link.href = `https://jonkler67.gay/pages/blog/${latestBlog}.html`
    link.innerText = `${latestBlog} Created On: ${latestBlogDate}`
    document.getElementById("newest-blog").appendChild(link)
  })
  .catch(error => {
    console.error('Error fetching or parsing JSON:', error);
  });


function newBlogElement(name, date) {
  return `<a href='https://jonkler67.gay/pages/blog/${name}.html'>${name} Created On: ${date}</a>`
}
