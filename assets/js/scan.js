$(document).ready(function (e) {
    const baseURL = window.localStorage.getItem("address");
    let usersArray = [];

    fetch(baseURL + "/api/v1/user", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: "Bearer " + window.localStorage.getItem("access_token"),
        },
    })
        .then(response => {
            if (!response.ok) {
                if (!response.statusCode === 401) {
                    window.location.replace(baseURL + "/dashboard");
                }
                response.json().then(result => {
                    console.log(result);
                    window.localStorage.setItem("access_token", result["access_token"]);
                });
            } else {
                response.json().then(result => {
                    console.log(result);
                    window.localStorage.setItem("access_token", result["access_token"]);
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

});