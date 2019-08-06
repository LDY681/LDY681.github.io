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
        $.notify("请先登录!",{position:"top-center", className: "error"});
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
            saveAvatarUrl().then(function(){
                fetchEquipInfo().then(function(res){
                    console.log("跳转到主页");
                    window.location.href = "../html/index.html";
                }, (function(error){alert(JSON.stringify(error));}));
            }, function (error) {
                alert(JSON.stringify(error));
            });
        }, (function(error){alert(JSON.stringify(error));}));
    }, (function (error) {
        alert(JSON.stringify(error));
    }));
}

//每次登录都会刷新AV.User.current
function logIn() {
    var username = $('#loginUsername').val();
    var password = $('#loginPassword').val();

    AV.User.logIn(username, password).then(function (loginedUser) {
        console.log("登录成功:");
        console.log(loginedUser);
        saveAvatarUrl().then(function(){
            console.log("avatar设置完毕");
            fetchEquipInfo().then(function(res){
                console.log("跳转到主页");
                window.location.href = "../html/index.html";
            }, (function(error){
                console.log(error);
                alert(JSON.stringify(error));
            }));
        }, function (error) {
            alert(JSON.stringify(error));
        });
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

function saveAvatarUrl(){
    var query = new AV.Query('_User');
    query.include('avatar');
    return query.get(AV.User.current().id).then (function (userData){
        var avatar = userData.get("avatar");
        var avatarUrl;
        if (avatar != null){
            console.log("有avatar");
            avatarUrl = avatar.get("image").get("url");
        }else{
            console.log("没有avatar");
            avatarUrl = "http://lc-q48bubuw.cn-e1.lcfile.com/e52cdcfbb6952a296362/%E7%82%B9%E6%88%91%E8%AE%BE%E7%BD%AE%E5%A4%B4%E5%83%8F.jpg";
        }

        localStorage.setItem('avatarUrl', JSON.stringify({
            avatarUrl
        }));

        return new Promise(function(resolve, reject) {
            if (JSON.parse(localStorage.getItem('avatarUrl')) === undefined){
                reject(new Error("avatarUrl didn't set successfully"));
            }else{
                resolve();
            }
        });
    });
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


