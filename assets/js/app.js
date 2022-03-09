import Cookies from "js-cookie";

$(document).ready(function () {

    const baseURL = "http://127.0.0.1:8000";
    const apiBaseURL = "/api/v1/";


    //remove access_token from localstorage when leaving page
    window.onbeforeunload = () => {
        localStorage.removeItem('access_token');
    }

    //check if access_token exists
    if (window.localStorage.getItem("access_token") != null) {
        $(".logged-out-container").hide();
    } else {
        $('.logged-in-container').hide();
    }

    //toggle for burger menu
    $(".navbar-burger").click(function () {
        $(".navbar-burger").toggleClass("is-active");
        $(".navbar-menu").toggleClass("is-active");
    });

    $("#login-modal .modal-close, .login,#login-modal .modal-background").click(function () {
        $("#login-modal").toggleClass("is-active");
    });

    $("#register-modal .modal-close, .register,#register-modal .modal-background").click(function () {
        $("#register-modal").toggleClass("is-active");
    });

    $("#login-form").submit(function (e) {
        e.preventDefault();

        fetch(baseURL + apiBaseURL + 'auth/login', {
            method: 'POST',
            headers: {
                Authorization: "Basic "+ btoa($('#login-form input[name=email]').val() + ":" + $('#login-form input[name=password]').val())
            }
        })
            .then(response => response.json())
            .then(result => {
                //saves access_token in localstorage
                window.localStorage.setItem("access_token", result["access_token"]);
                //swaps login and logout buttons
                toggleButtons();
                //closes login modal
                $("#login-modal").toggleClass("is-active");
            })
            .catch((error) => console.log("Error: "+ error))
    });

    $('.logout').click(function (e) {
        window.localStorage.removeItem("access_token");
        toggleButtons();
        //go back to home page
        window.location.replace(baseURL + "/dashboard")
    })

    function toggleButtons(){
        $(".logged-out-container").toggle();
        $(".logged-in-container").toggle();
    }



});