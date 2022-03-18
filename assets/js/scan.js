$(document).ready(function (e) {
    const baseURL = window.sessionStorage.getItem("address");
    let usersArray = [];

    fetch(baseURL + "/api/v1/user", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: "Bearer " + window.sessionStorage.getItem("access_token"),
        },
    })
        .then(response => {
            if (!response.ok) {
                if (!response.statusCode === 401) {
                    window.location.replace(baseURL + "/dashboard");
                }
                response.json().then(result => {
                    console.log(result);
                    window.sessionStorage.setItem("access_token", result["access_token"]);
                });
            } else {
                response.json().then(result => {
                    console.log(result);
                    window.sessionStorage.setItem("access_token", result["access_token"]);
                    result["data"].forEach(function(user) {
                        usersArray.push({id: user["id"], text: user["email"]});
                    });
                    console.log(JSON.stringify(usersArray));

                    $("#userEmailInput").select2({
                        data: usersArray,
                        dropdownAutoWidth: true,
                    });
                });
            }
        })
        .catch(error => {
            console.log(error);
        });

    $("#searchUserForm").submit(function (e) {
        e.preventDefault();

        $("#findUser").toggleClass("is-active");
        console.log($("#userEmailInput").val());
    });

    $("#searchClose, .modal-background").click(function (e) {
        $("#findUser").toggleClass("is-active");
    });

    $("#findUser").submit(function (e) {
        e.preventDefault();

        fetch(baseURL + "/api/v1/stripcard/" + window.sessionStorage.getItem("id"), {
            method: "POST",
            headers: {
                authorization: "Bearer " + window.sessionStorage.getItem("access_token")
            },
            body: JSON.stringify({"change": $('select[name="userAmount"]').val()})
        })
            .then(response => {
                $("#errorMessage").hide();
                $("#successMessage").hide();
                if (!response.ok) {
                    console.log("Er is iets mis gegaan, probeer het later opnieuw.");
                    if (response.statusCode === 401) {
                        window.localStorage.clear();
                        $("#errorMessage > p").text(result["message"]);
                        $("#errorMessage").show();
                        console.log("401");
                        window.location.replace(baseURL + "/dashboard")
                    } else {
                        response.json().then(result => {
                            console.log(result);
                            window.sessionStorage.setItem("access_token", result["access_token"]);
                            $("#errorMessage > p").text(result["message"]);
                            $("#errorMessage").show();
                        });
                    }
                } else {
                    response.json().then(result => {
                        console.log(result);
                        window.sessionStorage.setItem("access_token", result["access_token"]);
                        $("#successMessage > p").text(result["message"]);
                        $("#successMessage").show();
                    });
                }
            })
            .catch(error => {
                console.log(error);
                    $("#errorMessage > p").text("Er is iets mis gegaan, probeer het later opnieuw.");
                    $("#errorMessage").show();
            });
    });

});