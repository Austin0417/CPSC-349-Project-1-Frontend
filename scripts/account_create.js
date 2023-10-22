


createAccountPage();


function createAccountPage() {
    let mainForm = document.querySelector(".create-account-form");

    if (mainForm) {
        mainForm.addEventListener("submit", function(event) {
            event.preventDefault();
            let inputValues = document.forms["create-account"].getElementsByTagName("input");
            let data = {};
            data["email"] = inputValues[0].value;
            data["username"] = inputValues[1].value;
            data["password"] = inputValues[2].value;
            console.log(JSON.stringify(data));
            fetch("http://localhost:8080/api/users", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network Error!");
                }
                return response.text();
            })
            .then(data => {
                console.log(data);
                alert("Account creation success");
                window.location.href = 'login.html';
                
            })
            .catch(error => {
                console.error("A problem occurred performing the POST request", error);
            })
        })
    
    }
}
