import $ from 'jquery';

$(document).ready(function () {

    const baseURL = "http://127.0.0.1:8000";
    const apiBaseURL = "/api/v1/";

    //check if access_token exists
    if (window.localStorage.getItem("access_token") != null) {
        $(".logged-out-container").hide();
        updateMenu();
    } else {
        $('.logged-in-container').hide();
        $("#burgerButton").hide();
        $(".navbar-start").hide();
        $(".navbar-end").hide();
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
            .then(response => {
                if (!response.ok) {
                    response.json().then(result => {
                        console.log(result);
                        $("#login-failed > p").text(result["message"]);
                        $("#login-failed").show();
                    });
                } else {
                    response.json().then(result => {
                        //saves access_token in localstorage
                        window.localStorage.setItem("access_token", result["access_token"]);
                        window.localStorage.setItem("id", result["id"]);
                        //swaps login and logout buttons
                        toggleButtons();
                        //update dashboard page
                        getUser(window.localStorage.getItem("id"));
                        //closes login modal
                        $("#login-modal").toggleClass("is-active");
                        $("#login-failed").hide()
                    });
                }
            }).catch((error) => {
                console.log("Error: "+ error);
            })
    });

    $("#register-form").submit(function (e) {
        e.preventDefault();
        console.log($("#registerPassword").val() + ":" + $("#registerRepeatPassword").val())
        if ($("#registerPassword").val() === $("#registerRepeatPassword").val()) {
            fetch(baseURL + apiBaseURL + 'auth/register', {
                method: 'POST',
                body: JSON.stringify({email: $("#registerEmail").val(), password: $("#registerPassword").val()})
            })
                .then(response => {
                    if (!response.ok) {
                        response.json().then(result => {
                            console.log(result);
                            $("#register-failed > p").text(result["message"]);
                            $("#register-failed").show();
                        });
                    } else {
                        response.json().then(result => {
                            console.log(result);
                            //closes login modal
                            $("#register-modal").toggleClass("is-active");
                            $("#register-failed").hide()
                        });
                    }
                }).catch((error) => {
                console.log("Error: " + error);
            })
        } else {
            //passwords not matching.
            console.log("passwords not matching")
            $("#register-failed > p").text("Wachtwoorden komen niet overeen.");
            $("#register-failed").show();
        }
    });

    $('.logout').on("click", function() {
        logout()
    });

    function updateMenu() {
        switch (JSON.parse(window.localStorage.getItem("user"))["roles"][0]) {
            case "ROLE_USER":
                $(".role-user").show();
                $(".role-stamper").hide();
                $(".role-penningmeester").hide();
                break;
            case "ROLE_STAMPER":
                $(".role-user").show();
                $(".role-stamper").show();
                $(".role-penningmeester").hide();
                break;
            case "ROLE_PENNINGMEESTER":
                $(".role-user").show();
                $(".role-stamper").show();
                $(".role-penningmeester").show();
                break;
            default:
                $(".role-user").hide();
                $(".role-stamper").hide();
                $(".role-penningmeester").hide();
                break;
        }
    }

    function toggleButtons(){
        $(".logged-out-container").toggle();
        $(".logged-in-container").toggle();
        ($(".navbar-start").css("display") == 'none') ? ($(".navbar-start").show()) : ($(".navbar-start").hide());
        ($(".navbar-end").css("display") == 'none') ? $(".navbar-end").show() : $(".navbar-end").hide();
        ($("#burgerButton").css("display") == 'none') ? $("#burgerButton").show() : $("#burgerButton").hide();
    }

    function logout() {
        window.localStorage.removeItem("access_token");
        window.localStorage.removeItem("id");
        window.localStorage.removeItem("user");
        toggleButtons();
        //go back to home page
        window.location.replace(baseURL + "/dashboard")
    }

    function getUser(id) {
        fetch(baseURL + apiBaseURL + "user/" + id, {
            method: 'GET',
            headers: {
                authorization: "Bearer " + window.localStorage.getItem("access_token")
            }
        }).then(response => {
            if (!response.ok) {
                console.log("log opnieuw in");
                logout();
            } else {
                response.json().then(result => {
                    window.localStorage.setItem("access_token", result["access_token"]);
                    window.localStorage.setItem("user", JSON.stringify(result["data"][0]));
                    updateMenu();
                })
            }
        }).catch(error => {
            console.log(error);
        })
    }
});