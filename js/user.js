$(function() {
    $(".loginForm").on('submit', function(e) {
        e.preventDefault();
        logIn();
    });
    $(".signupForm").on('submit', function(e) {
        e.preventDefault();
        signUp();
    });
});

function signUp() {
    var username = $('#signinUsername').val();
    var password = $('#signinPassword').val();
    var email = $('#signinEmail').val();
    var inviter = $('#signinInviter').val();

    var user = new AV.User();
    user.setUsername(username);
    user.setPassword(password);
    user.setEmail(email);
    user.set('inviter', inviter);
    user.signUp().then(function () {
        alert("注册成功,欢迎"+ username + "!");
        window.location.href = "../html/index.html";
    }, (function (error) {
        alert(JSON.stringify(error));
    }));
}

function logIn() {
    var username = $('#loginUsername').val();
    var password = $('#loginPassword').val();

    // LeanCloud - 登录
    // https://leancloud.cn/docs/leanstorage_guide-js.html#用户名和密码登录
    AV.User.logIn(username, password).then(function () {
        alert("登录成功,欢迎"+ username + "!");
        window.location.href = "../html/index.html";
    }, function (error) {
        alert("登录失败");
        alert(JSON.stringify(error));
    });
};

function isCurrentUser () {
    var currentUser = AV.User.current();
    return !!currentUser;
}

function logout() {
    AV.User.logOut();
    window.location.href = "./../login/login.html";
}
