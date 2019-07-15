// user登录，注册，登出，当前用户check，由login.html和templateXXX.html调用

$(function() {
    $(".loginForm").on('submit', function(e) {
        e.preventDefault();
        console.log("login");
        logIn();
    });
    $(".signupForm").on('submit', function(e) {
        e.preventDefault();
        console.log("signUp");
        signUp();
    });

    if (!isCurrentUser() && window.location.href.indexOf("login") === -1) {
        window.location.href = "../html/login.html#needLogin";
    }

    if(window.location.hash === '#needLogin')
    {
        $("#loginNotifier").show();

        setTimeout(function () {
            $("#loginNotifier").hide()
           }, 1500);
    }
});

function signUp() {
    var user = new AV.User();
    user.setUsername($('#signinUsername').val());
    user.setPassword($('#signinPassword').val());
    user.setEmail($('#signinEmail').val());
    user.signUp().then(function (loginedUser) {
        console.log("注册信息:");
        console.log(loginedUser);
        window.location.href = "../html/index.html";
    }, (function (error) {
        alert(JSON.stringify(error));
    }));
}

function logIn() {
    var username = $('#loginUsername').val();
    var password = $('#loginPassword').val();

    AV.User.logIn(username, password).then(function (loginedUser) {
        console.log("登录信息:");
        console.log(loginedUser);
        window.location.href = "../html/index.html";
    }, function (error) {
        alert(JSON.stringify(error));
    });
}

function logOut(){
    AV.User.logOut();
}

function isCurrentUser () {
    var currentUser = AV.User.current();
    if (currentUser) {
        return true;
    }
    return false;
};


