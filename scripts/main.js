// Array that will store the id of each post, with the top post's id being at index 0
const postIds = [];

// Array that will store the upvote counts of each post (index 0 will represent number of upvotes for the first post at the top of the page)
let upvoteCounts = [];

// Dictionary that will have post id as keys, and boolean value as value
// Keeps track of the current user's upvote status on each post. This will be used to determine whether an Upvote should be added, or removed
// E.g if a Post with id of 5 is upvoted by the current user, it will look like {5 : true}
const userUpvotes = {};

let voteCount = 0;

const user_id = localStorage.getItem("user_id");


// If returning to the main page via the browser's back arrow, reload the page
window.onpageshow = function(event) {
    if (window.performance.navigation.type === 2) {
        console.log("back arrow");
        window.location.reload();
    }
}
main();


// Simple check to see if the user was logged in correctly (user_id was retrieved correctly)
function shouldLoadPosts() {
    return localStorage.getItem("user_id") >= 0;
}

function addEventHandlers() {
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
        shouldReload = true;
        window.location.href = "login.html";
    })


    // On form submit, perform a POST request to the backend, which will create a new post belonging to the current userId
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
        shouldReload = true;
        window.location.href = "my-posts.html";
    });
}

// Using the stored user_id, query the database for all posts having userId == user_id
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
}

function main() {
    postsPage();
    addEventHandlers();
}


function createPostTitleDiv(post) {
    let postTitleDiv = document.createElement('div');
    postTitleDiv.classList.add('post-title');

    let title = document.createElement('h2');
    title.textContent = post['title'];
    let postAuthor = document.createElement('h3');
    postAuthor.textContent = "Posted by: " + post['user']['username'];
    postTitleDiv.append(postAuthor);
    postTitleDiv.append(title);
    return postTitleDiv;

}

function createPostImageDiv(post) {
    let postImageDiv = document.createElement('div');
    postImageDiv.classList.add("post-image");
    let postImage = document.createElement('img');
    postImage.setAttribute('alt', "Post Image");
    postImage.setAttribute('src', post['imageUrl']);

    postImageDiv.append(postImage);
    return postImageDiv;
}

function createPostContentDiv(post) {
    let postContentDiv = document.createElement('div');
    postContentDiv.classList.add('post-content');
    let content = document.createElement('h4');
    content.textContent = post['textContent'];
    console.log("Text content for post id=" + post['id'] + ": " + post['textContent']);
    postContentDiv.append(content);

    return postContentDiv;
}

function createPostVoteDiv(upvotes, post_index) {
    let postVoteDiv = document.createElement('div');
    postVoteDiv.classList.add('post-footer');
    let upvoteBtn = document.createElement('img');
    upvoteBtn.classList.add("upvote-image");

    if (checkUserHasUpvotedPost(upvotes)) {
        console.log("Setting active upvote icon");
        upvoteBtn.setAttribute('src', 'resources/upvote.png');
        userUpvotes[postIds[post_index]] = true;
    } else {
        console.log("Setting inactive upvote icon");
        upvoteBtn.setAttribute('src', 'resources/upvote-inactive.png');
        userUpvotes[postIds[post_index]] = false;
    }
    upvoteBtn.setAttribute('alt', "upvote-image");
    let voteDisplay = document.createElement('h2');
    voteDisplay.classList.add('.upvote-count');
    voteDisplay.textContent = upvotes.length;
    upvoteCounts.push(voteDisplay);

    postVoteDiv.append(voteDisplay);
    postVoteDiv.append(upvoteBtn);

    return [postVoteDiv, upvoteBtn];
}

// Helper method to easily add new Posts to the existing posts-container div
function appendPost(post, upvotes, post_index) {
    console.log(post);
    let postContainer = document.querySelector(".posts-container");
    let postDiv = document.createElement('div');
    postDiv.classList.add("post");
    let postTitleDiv = createPostTitleDiv(post);
    let postImageDiv = createPostImageDiv(post);
    let postContentDiv = createPostContentDiv(post);
    let [postVoteDiv, upvoteBtn] = createPostVoteDiv(upvotes, post_index);

    upvoteBtn.addEventListener('click', function(event) {
        console.log("Upvote clicked");
        if (userUpvotes[postIds[post_index]]) {
            // DELETE request for Upvote
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
                upvoteBtn.setAttribute('src', 'resources/upvote-inactive.png');
            })
        } else {
            // POST request for Upvote
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
                upvoteBtn.setAttribute('src', 'resources/upvote.png');
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
    postDiv.append(postVoteDiv);
    postContainer.append(postDiv);
}

// Method that will loop through all of the upvotes (Array of JSON Objects under each Post) and check if the upvote's user_id matches the current userId
// If it matches, set the upvote arrow to be orange
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