import QrCreator from "qr-creator";

$(document).ready(function (e) {

    const baseURL = window.sessionStorage.getItem("address");
    const apiBaseURL = "/api/v1/";

    //generate Qr-code
    QrCreator.render({
        text: window.sessionStorage.getItem("id"),
        radius: 0,
        ecLevel: 'H',
        fill: '#000000',
        background: '#ffffff',
        size: 128
    }, document.querySelector('#qr-code'));

    // $("#user-email").text(JSON.parse(window.sessionStorage.getItem("user"))["email"]);
    console.log(JSON.parse(window.sessionStorage.getItem("user")));

    getStrippenkaart(window.sessionStorage.getItem("id"));

    function getStrippenkaart(userId) {
        fetch(baseURL + apiBaseURL + "stripcard/" + userId, {
            method: "GET",
            headers: {
                authorization: "Bearer " + window.sessionStorage.getItem("access_token")
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
                        window.sessionStorage.setItem("access_token", result["access_token"]);
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
        window.sessionStorage.removeItem("access_token");
        window.sessionStorage.removeItem("id");
        window.sessionStorage.removeItem("user");
        toggleButtons();
        //go back to home page
        window.location.replace(baseURL + "/dashboard")
    }
});