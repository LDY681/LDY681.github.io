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
/*    let inviter = $('#signinInviter').val();
        let params = {
            username: $('#signinUsername').val(),
            password: $('#signinPassword').val(),
            email: $('#signinEmail').val(),
        };*/
/*Bmob.User.register(params).then(res => {
        console.log("注册信息:");
        console.log(res);

        //下线设置上线
        let query1 = Bmob.Query('inviter');
        query1.set("username", $('#signinUsername').val());
        query1.set("inviter", inviter);
        query1.save().then(res => {
            console.log("下线设置上线:");
            console.log(res);

            //上线设置下线
            let query2 = Bmob.Query('inviter');
            query2.get(inviter).then(res => {
                console.log("上线设置下线:");
                console.log(res);
                query2.set("invitee", $('#signinUsername').val());
            }).catch(err => {

                //如果上线用户名不存在
                console.log(err);

            });
        }).catch(err => {
            console.log(err);

        });
        // }

        // window.location.href = "../html/index.html";
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
    });*/
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

/*    Bmob.User.login(username,password).then(res => {
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
    });*/
}

function logOut(){
    AV.User.logOut();
    var currentUser = AV.User.current();
}
