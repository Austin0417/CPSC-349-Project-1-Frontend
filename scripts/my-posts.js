
let postDialog = document.querySelector("#post-dialog");
let closePostDialog = document.querySelector("#close-dialog-btn");
let postForm = document.querySelector("#post-form");
let confirmationDialog = document.querySelector(".confirmation-dialog");
let dialogPostTitle = document.querySelector("#postTitle");
let dialogPostBody = document.querySelector("#postBody");
let dialogPostImageUrl = document.querySelector("#postImage");


 // List of Post Objects, top-most post at index 0
let posts = [];

// Variable to keep track of current selected Post's id when Edit or Delete is clicked
let selectedPostId = -1;

// Will hold the updated JSON object for an edited Post, which will be sent along with the PUT request
let updatedPostData = {};


setEventHandlers();
fetchUserPosts();


function setEventHandlers() {
    closePostDialog.addEventListener('click', function(event) {
        postDialog.style.display = "none";
    });
    postForm.addEventListener('submit', function(event) {
        event.preventDefault();
        console.log("Submitting form...");
        updatedPostData['title'] = dialogPostTitle.value;
        updatedPostData['textContent'] = dialogPostBody.value;
        updatedPostData['imageUrl'] = dialogPostImageUrl.value;
        console.log("Updated Post: " + JSON.stringify(updatedPostData));
        postDialog.style.display = "none";
        document.body.style.cursor = "wait";

        // Make a PUT request to the server
        fetch("https://cpsc349p1.uw.r.appspot.com/api/posts?post_id=" + selectedPostId, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedPostData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Could not complete update request");
            }
            return response.text();
        })
        .catch(error => {
            document.body.style.cursor = "default";
            console.log(error);
        })
        .then(responseSuccess => {
            console.log(responseSuccess);
            updatedPostData = {};
            document.body.style.cursor = "default";
            window.location.reload();
        })

    })
    let confirmationAccept = document.querySelector(".confirm-delete");
    let confirmationDecline = document.querySelector(".cancel-delete");
    confirmationAccept.addEventListener('click', function(event) {
        event.preventDefault();
        document.body.style.cursor = "wait";
        console.log("Deleting post with id=" + selectedPostId);
        fetch("https://cpsc349p1.uw.r.appspot.com/api/posts/delete?post_id=" + selectedPostId, {
            method: "DELETE"
        })
        .then(response => {
            if (!response.ok) {
                return new Error("Couldn't delete selected post");
            }
            return response.text();
        })
        .catch(error => {
            document.body.style.cursor = "default";
            console.log(error);
        })
        .then(responseData => {
            console.log(responseData);
            document.body.style.cursor = "default";
            window.location.reload();
        })
        confirmationDialog.style.display = "none";
        // delay(500).then(() => {
        //     window.location.reload();
        // })
    })

    confirmationDecline.addEventListener('click', function(event) {
        confirmationDialog.style.display = "none";
    })
}

// GET request to the backend to retrieve all posts associated with the current userId
function fetchUserPosts() {
    let user_id = localStorage.getItem("user_id");
    console.log(user_id);
    if (user_id >= 0) {
        document.body.style.cursor = "wait";
        fetch("https://cpsc349p1.uw.r.appspot.com/api/posts/find?user_id=" + user_id, {
            method: "GET"
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Couldn't retrieve user posts");
            }
            return response.text();
        })
        .catch(error => {
            document.body.style.cursor = "default";
            console.log(error);
        })
        .then(userPosts => {
            let json = JSON.parse(userPosts);
            json.forEach((userPost, index) => {
                appendPost(userPost['title'], userPost['textContent'], userPost['imageUrl'], userPost['id'], index);
            })
            document.body.style.cursor = "default";
        })
    }
}


function appendPost(postTitle, postContent, postImageUrl, post_id, post_index) {
    let postContainer = document.querySelector(".posts-container");

    let postDiv = document.createElement('div');
    postDiv.classList.add("post");

    let postTitleDiv = document.createElement('div');
    let postImageDiv = document.createElement('div');
    let postContentDiv = document.createElement('div');

    postTitleDiv.classList.add("post-title");
    postImageDiv.classList.add("post-image");
    postContentDiv.classList.add('post-content');

    let title = document.createElement('h2');
    title.textContent = postTitle;

    let optionsDiv = document.createElement("div");
    optionsDiv.classList.add("options");
    let editButton = document.createElement("button");
    let deleteButton = document.createElement("button");
    editButton.textContent = "Edit";
    deleteButton.textContent = "Delete";
    optionsDiv.append(editButton);
    optionsDiv.append(deleteButton);

    editButton.addEventListener('click', function(event) {
        // Show the Edit dialog here
        selectedPostId = posts[post_index]['id'];
        console.log("Editing post with id=" + selectedPostId);
        postDialog.style.display = "block";
        console.log("Title: " + posts[post_index]['title']);
        console.log("Body: " + posts[post_index]['textContent']);
        console.log("Image URL: " + posts[post_index]['imageUrl']);
        dialogPostTitle.setAttribute("value", posts[post_index]['title']);
        dialogPostBody.textContent = posts[post_index]['textContent'];
        dialogPostImageUrl.setAttribute("value", posts[post_index]['imageUrl']);
    });
    deleteButton.addEventListener('click', function(event) {
        selectedPostId = posts[post_index]['id'];
        console.log(selectedPostId);
        confirmationDialog.style.display="block";
    });

    let postImage = document.createElement('img');
    postImage.alt = "Post Image";
    postImage.src = postImageUrl;

    let content = document.createElement('h4');
    content.textContent = postContent;

    postTitleDiv.append(optionsDiv);
    postTitleDiv.append(title);
    postImageDiv.append(postImage);
    postContentDiv.append(postContent);

    postDiv.append(postTitleDiv);
    postDiv.append(postImageDiv);
    postDiv.append(postContentDiv);

    postContainer.append(postDiv);

    let postObject = {'id': post_id, 'title': postTitle, 'imageUrl': postImageUrl, 'textContent': postContent};
    posts.push(postObject);
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }