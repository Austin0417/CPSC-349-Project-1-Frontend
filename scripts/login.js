loginPage();

function loginPage() {
    let loginForm = document.querySelector(".login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", function(event) {
            event.preventDefault();
            let inputValues = document.forms['login-form'].getElementsByTagName('input');
            let userOrEmail = inputValues[0].value;
            let password = inputValues[1].value;
            let errorText = document.querySelector(".invalid-credentials-text");
            if (userOrEmail && password) {
                fetch("http://localhost:8080/api/users/find?userOrEmail=" + userOrEmail + "&password=" + password, 
                {
                    method: 'GET',
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Error processing login GET request: " + response)
                    }
                    return response.text();
                })
                .then(data => {
                    try {
                        let user = JSON.parse(data);
                        console.log(user['user_id']);
                        localStorage.setItem("user_id", user['user_id']);
                        localStorage.setItem("username", user['username'])
                        window.location.href = 'main.html';
                    } catch (e) {
                        if (e instanceof SyntaxError) {
                            console.log("Invalid credentials");
                            inputValues[0].classList.add("invalid");
                            inputValues[1].classList.add("invalid");
                            errorText.textContent = "Username/Email or Password were incorrect!";
                            errorText.style.display = "block";
                        }
                    }
                })
                .catch(error => {
                    console.log(error);
                })
            }
        })
    }
}