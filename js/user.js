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

}

function logIn() {
    var username = $('#loginUsername').val();
    var password = $('#loginPassword').val();

    Bmob.User.login(username,password).then(res => {
        console.log(res);
        window.location.href = "../html/index.html";
    }).catch(err => {
        switch (err.code) {
            case 101:
                alert("账号或密码错误");
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

