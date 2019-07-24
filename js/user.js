// user登录，注册，登出，当前用户check，由login.html和templateXXX.html调用

//user注册,登录,登出,是否currentUser
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
    user.signUp().then(function (userData) {
        console.log("注册信息:");
        console.log(userData);

        //新建装备信息
        var equip = new AV.Object('equip');
        userData.set('equip', equip);
        equip.set('owner',userData);
        equip.save().then(function(){
            fetchEquipInfo().then(function(res){
                console.log(res);
                window.location.href = "../html/index.html";
            }, (function(error){alert(JSON.stringify(error));}));
        }, (function(error){alert(JSON.stringify(error));}));
    }, (function (error) {
        alert(JSON.stringify(error));
    }));
}

//美此登录都会刷新AV.User.current
function logIn() {
    var username = $('#loginUsername').val();
    var password = $('#loginPassword').val();

    AV.User.logIn(username, password).then(function (loginedUser) {
        console.log("登录信息:");
        console.log(loginedUser);
        fetchEquipInfo().then(function(res){
            window.location.href = "../html/index.html";
        }, (function(error){alert(JSON.stringify(error));}));
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
}

//通用方法
//获取url parameter,如果parameter不存在,则varaible的默认值等于 defaultvalue
// 用法 var mycity = getUrlParam('cityId','1');
function getUrlParam(parameter, defaultValue){
    var urlparameter = defaultValue;
    if(window.location.href.indexOf(parameter) > -1){
        urlparameter = getUrlVars()[parameter];
    }
    return urlparameter;
}

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

//round value precision
function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}

//根绝min max区间随机取值
function getRandomArbitrary(min, max){
    var random = Math.random() * (max - min) + min;
    return round(random,2);
}


