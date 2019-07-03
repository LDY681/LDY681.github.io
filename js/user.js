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
    let params = {
        username: $('#signinUsername').val(),
        password: $('#signinPassword').val(),
        email: $('#signinEmail').val(),
        inviter: $('#signinInviter').val(),
    };
    Bmob.User.register(params).then(res => {
        console.log(res);
        window.location.href = "../html/index.html";
    }).catch(err => {
        switch (err.code) {
            case 202:
                alert("账号已存在,请直接登录");
                break;
            case 203:
                alert("邮箱已占用,请重新选择");
                break;
            default:
                alert("请重新输入用户名密码");
                break;
        }
        console.log(err);
    });

/*    var username = $('#signinUsername').val();
    var password = $('#signinPassword').val();
    var email = $('#signinEmail').val();
    var inviter = $('#signinInviter').val();
    var user = new AV.User();
    user.setUsername(username);
    user.setPassword(password);
    user.setEmail(email);
    user.set('inviter', inviter);
    user.signUp().then(function () {
        window.location.href = "../html/index.html";
    }, (function (error) {
        switch (error.code) {
            case 202:
                alert("账号已存在,请直接登录");
                break;
            case 203:
                alert("邮箱已占用,请重新选择");
                break;
            default:
                alert("请重新输入用户名密码");
                break;
        }
        console.log(JSON.stringify(error));
    }));*/
}

function logIn() {
    var username = $('#loginUsername').val();
    var password = $('#loginPassword').val();

    Bmob.User.login(username,password).then(res => {
        console.log(res);
        window.location.href = "../html/index.html";
    }).catch(err => {
        switch (error.code) {
            case 211:
                alert("用户名不存在");
                break;
            case 210:
                alert("密码错误,请重试");
                break;
            default:
                alert("请重新输入用户名密码");
                break;
        }
        console.log(err);
    });

/*    AV.User.logIn(username, password).then(function () {
        window.location.href = "../html/index.html";
    }, function (error) {
        switch (error.code) {
            case 211:
                alert("用户名不存在");
                break;
            case 210:
                alert("密码错误,请重试");
                break;
            default:
                alert("请重新输入用户名密码");
            break;
        }
        console.log(JSON.stringify(error));
    });*/
}
function updateCache(objectId) {
    Bmob.User.updateStorage(objectId).then(res => {
        console.log(res);
    }).catch(err => {
        console.log(err);
    });

}

function logOut(){
    Bmob.User.logout();
}

