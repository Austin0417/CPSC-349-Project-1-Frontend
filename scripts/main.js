
const postIds = [];
const userUpvotes = {};
let upvoteCounts = [];
const user_id = localStorage.getItem("user_id");


main();


function shouldLoadPosts() {
    return localStorage.getItem("user_id") >= 0;
}

function postsPage() {
    if (shouldLoadPosts()) {
        fetch('http://localhost:8080/api/posts', {
            method: 'GET'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Couldn't GET all posts");
            }
            return response.text();
        })
        .then(posts => {
            let json = JSON.parse(posts);
            json.forEach((post, index) => {
                console.log("Post id=" + post['id']);
                console.log(post['upvotes'].length);
                postIds.push(post['id']);
                appendPost(post, post['upvotes'], index);
            })
            console.log(userUpvotes);
        })
        .catch(error => {
            console.log(error);
        })
    }
    let toggleBtn = document.querySelector("#toggleBtn");
    let closeBtn = document.querySelector("#closeBtn");
    let sidebar = document.querySelector("#sidebar");
    let postDialog = document.querySelector("#post-dialog");
    let closePostDialog = document.querySelector("#close-dialog-btn");

    let createPosts = document.querySelector("#create-post");
    let viewPosts = document.querySelector("#view-my-posts");
    let postForm = document.querySelector("#post-form");
    let logout = document.querySelector("#logout");

    toggleBtn.addEventListener("click", function (event) {
        sidebar.style.right = '0';
        toggleBtn.classList.add("disable-btn");
    });
    closeBtn.addEventListener("click", function(event) {
        sidebar.style.right = '-250px';
        toggleBtn.classList.remove('disable-btn');
    });

    createPosts.addEventListener("click", function(event) {
        event.preventDefault();
        console.log("Creating post");
        postDialog.style.display = 'block';
    });
    closePostDialog.addEventListener("click", function(event) {
        postDialog.style.display = 'none';
    });
    logout.addEventListener('click', function(event) {
        localStorage.setItem("user_id", -1);
        window.location.href = "login.html";
    })


    postForm.addEventListener('submit', function(event) {
        event.preventDefault();
        postDialog.style.display = 'none';
        let formInputs = postForm.elements;

        let postTitle = formInputs[0].value;
        let postContent = formInputs[1].value;
        let imageUrl = formInputs[2].value;

        let data = {};
        data['title'] = postTitle;
        data['textContent'] = postContent;
        data['imageUrl'] = imageUrl;
        data['username'] = localStorage.getItem('username');
        console.log(data);
        let current_user_id = localStorage.getItem('user_id');
        console.log(current_user_id);
        if (current_user_id >= 0) {
            fetch("http://localhost:8080/api/posts?user_id=" + current_user_id, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error processing POST request for creating a post");
                }
                return response.text();
            })
            .then(data => {
                console.log(data);
            })
            .catch(error => {
                console.log(error);
            });
        }
        window.location.reload(true);
    })

    viewPosts.addEventListener('click', function(event) {
        event.preventDefault();
        window.location.href = "my-posts.html";
    });
}

function main() {
    postsPage();
}


function appendPost(post, upvotes, post_index) {
    console.log(post);
    let postContainer = document.querySelector(".posts-container");

    let postDiv = document.createElement('div');
    postDiv.classList.add("post");

    let postTitleDiv = document.createElement('div');
    let postImageDiv = document.createElement('div');
    let postContentDiv = document.createElement('div');
    let upvoteDiv = document.createElement('div');

    postTitleDiv.classList.add("post-title");
    postImageDiv.classList.add("post-image");
    postContentDiv.classList.add('post-content');
    upvoteDiv.classList.add('post-footer');

    let title = document.createElement('h2');
    title.textContent = post['title'];
    let postAuthor = document.createElement('h3');
    postAuthor.textContent = "Posted by: " + post['user']['username'];
    postTitleDiv.append(postAuthor);

    let postImage = document.createElement('img');
    postImage.alt = "Post Image";
    postImage.src = post['imageUrl'];

    let content = document.createElement('h4');
    content.textContent = post['textContent'];
    console.log("Text content for post id=" + post['id'] + ": " + post['textContent']);

    postTitleDiv.append(title);
    postImageDiv.append(postImage);
    postContentDiv.append(content);

    let upvoteImg = document.createElement('img');
    upvoteImg.classList.add("upvote-image");


    if (checkUserHasUpvotedPost(upvotes)) {
        console.log("Setting active upvote icon");
        upvoteImg.setAttribute('src', 'resources/upvote.png');
        userUpvotes[postIds[post_index]] = true;
    } else {
        console.log("Setting inactive upvote icon");
        upvoteImg.setAttribute('src', 'resources/upvote-inactive.png');
        userUpvotes[postIds[post_index]] = false;
    }

    upvoteImg.setAttribute('alt', "upvote-image");
    let upvoteCount = document.createElement('h2');
    upvoteCount.classList.add('.upvote-count');
    upvoteCount.textContent = upvotes.length;
    upvoteCounts.push(upvoteCount);

    upvoteDiv.append(upvoteCount);
    upvoteDiv.append(upvoteImg);

    upvoteImg.addEventListener('click', function(event) {
        console.log("Upvote clicked");
        if (userUpvotes[postIds[post_index]]) {
            // Remove upvote
            fetch('http://localhost:8080/api/upvotes/remove?user_id=' + user_id + '&post_id=' + postIds[post_index], {
                method: "DELETE"
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Upvote DELETE request error");
                }
                return response.text();
            })
            .catch(error => {
                alert("An error occurred while trying to remove the upvote. Please try again");
            })
            .then(responseText => {
                console.log(responseText);
                let upvoteCountElement = upvoteCounts[post_index];
                let numUpvotes = parseInt(upvoteCountElement.textContent, 10);
                upvoteCountElement.textContent = --numUpvotes;
                upvoteImg.setAttribute('src', 'resources/upvote-inactive.png');
            })
        } else {
            // Post upvote
            fetch('http://localhost:8080/api/upvotes?user_id=' + user_id + '&post_id=' + postIds[post_index], {
                method: "POST"
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Upvote POST error");
                }
                return response.text();
            })
            .catch(error => {
                alert("An error occurred while trying to upvote the post. Please try again");
            })
            .then(responseText => {
                console.log(responseText);
                upvoteImg.setAttribute('src', 'resources/upvote.png');
                let upvoteCountElement = upvoteCounts[post_index];
                console.log(upvoteCountElement);
                let numUpvotes = parseInt(upvoteCountElement.textContent, 10);
                upvoteCountElement.textContent = ++numUpvotes;
            })
        }
        userUpvotes[postIds[post_index]] = !userUpvotes[postIds[post_index]];
    })

    postDiv.append(postTitleDiv);
    postDiv.append(postImageDiv);
    postDiv.append(postContentDiv);
    postDiv.append(upvoteDiv);

    postContainer.append(postDiv);
}

function checkUserHasUpvotedPost(upvotes) {
    let result = false;
    upvotes.forEach(upvote => {
        let upvote_user_id = upvote['user']['userId'];
        console.log("Checking userId=" + user_id + " vs. upvote user id=" + upvote_user_id);
        if (upvote_user_id == user_id) {
            console.log("True");
            result = true;
        }
    })
    return result;
}