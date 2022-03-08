import Cookies from "js-cookie";

$(document).ready(function () {
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

        fetch('http://127.0.0.1:8000/api/v1/auth/login', {
            method: 'POST',
            headers: {
                Authorization: "Basic "+ btoa($('#login-form input[name=email]').val() + ":" + $('#login-form input[name=password]').val())
            }
        })
            .then(response => response.json())
            .then(result => {
                console.log("Success: "+ result['access_token']);
                Cookies.set('access_token', result['access_token']);
                console.log(Cookies.get('access_token'));
            })
            .catch((error) => console.log("Error: "+ error))
    });


});