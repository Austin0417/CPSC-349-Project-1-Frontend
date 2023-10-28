


createAccountPage();


function createAccountPage() {
    let mainForm = document.querySelector(".create-account-form");

    if (mainForm) {
        mainForm.addEventListener("submit", function(event) {
            event.preventDefault();
            document.body.style.cursor = "wait";
            let inputValues = document.forms["create-account"].getElementsByTagName("input");
            let data = {};
            data["email"] = inputValues[0].value;
            data["username"] = inputValues[1].value;
            data["password"] = inputValues[2].value;
            console.log(JSON.stringify(data));
            fetch("https://cpsc349p1.uw.r.appspot.com/api/users", {
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
                document.body.style.cursor = "default";
                window.location.href = 'login.html';
                
            })
            .catch(error => {
                console.error("A problem occurred performing the POST request", error);
                document.body.style.cursor = "default";
            })
        })
    
    }
}
