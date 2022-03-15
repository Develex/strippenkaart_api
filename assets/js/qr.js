import QrCreator from "qr-creator";

$(document).ready(function (e) {

    const baseURL = "http://127.0.0.1:8000";
    const apiBaseURL = "/api/v1/";

    //generate Qr-code
    QrCreator.render({
        text: window.localStorage.getItem("id"),
        radius: 0,
        ecLevel: 'H',
        fill: '#000000',
        background: '#ffffff',
        size: 128
    }, document.querySelector('#qr-code'));

    // $("#user-email").text(JSON.parse(window.localStorage.getItem("user"))["email"]);
    console.log(JSON.parse(window.localStorage.getItem("user")));

    getStrippenkaart(window.localStorage.getItem("id"));

    function getStrippenkaart(userId) {
        fetch(baseURL + apiBaseURL + "stripcard/" + userId, {
            method: "GET",
            headers: {
                authorization: "Bearer " + window.localStorage.getItem("access_token")
            }
            }).then(response => {
                if (!response.ok) {
                    console.log("log opnieuw in");
                    logout();
                } else {
                    response.json().then(result => {
                        console.log(result);
                        $("#user-strippen").text(result["data"]["strips"]);
                        $("#user-email").text(result["data"]["user"]["email"]);
                        window.localStorage.setItem("access_token", result["access_token"]);
                    })
                }
            }).catch(error => {
                console.log(error);
            })
        }

    function toggleButtons(){
        $(".logged-out-container").toggle();
        $(".logged-in-container").toggle();
    }

    function logout() {
        window.localStorage.removeItem("access_token");
        window.localStorage.removeItem("id");
        window.localStorage.removeItem("user");
        toggleButtons();
        //go back to home page
        window.location.replace(baseURL + "/dashboard")
    }
});