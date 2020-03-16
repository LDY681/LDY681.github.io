// user登录，注册，登出，当前用户check，由login.html和templateXXX.html调用

//user注册,登录,登出,是否currentUser

// 每跳转一个单页都要initialize一下，由templateXXX.html调用，嵌入的html不能调用，不然会报错

var { Query, User } = AV;
var { Realtime, TextMessage } = AV;
var APP_ID = 'GWIBfipLqh868acSJVJFbl1q-MdYXbMMI';
var APP_KEY = 'pFE0XYlY4QlTDwlrbbL4IQIY'
var server = 'https://jvchwdgn.lc-cn-n1-shared.com';

AV.init({
    appId: APP_ID,
    appKey: APP_KEY,
    serverUrls: server
});

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


//目前由login.html调用
// 确保调用accordionOn和Off的所有element都有initialize w3-hide 或 w3-show
// 展开accordion;用法:accordionOn(element id)
function accordionOn(id) {
    var x = document.getElementById(id)
    if (x.className.indexOf("w3-hide") !== -1) {
        x.className = x.className.replace("w3-hide", "w3-show");
    }
}
// 关闭accordion;用法:accordionOff(element id)
function accordionOff(id) {
    var x = document.getElementById(id);
    if (x.className.indexOf("w3-show") !== -1) {
        x.className = x.className.replace("w3-show", "w3-hide");
    }
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
            avatarUrl = "../img/点我设置头像.jpg";
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

function translator(english){
    switch(english){
        case "rice":
            return "谷物";
        case "iron":
            return "生铁";
        case "wood":
            return "原木";
        case "stone":
            return "粗石";
        case "food":
            return "军粮";
        case "weapon":
            return "兵器";
        case "ladder":
            return "云梯";
        case "rollingWood":
            return "滚木";
        case "fallingStone":
            return "落石";
        case "catapult":
            return "投石车";
        case "buy":
            return "买单";
        case "sell":
            return "卖单";
        case "weiguo":
            return "魏国";
        case "shuguo":
            return "蜀国";
        case "wuguo":
            return "吴国";
        case "huangjin":
            return "黄巾";
        case "weaponUp":
            return "武器碎片";
        case "equipUp":
            return "装备碎片";
        case "horseHelmetUp":
            return "马盔碎片";
        case "horseSaddleUp":
            return "马鞍碎片";
        case "horseUp":
            return "战马碎片";
        case "gold":
            return "黄金";
        case "weiMoney":
            return "魏钱";
        case "shuMoney":
            return "蜀钱";
        case "wuMoney":
            return "吴钱";
        case "huangMoney":
            return "黄钱";
        default:
            return english;
    }
}


function getItemUrl(item){
    var url = "";
    switch (item){
        case "rice":
            url ='https://cdn.e-sim.org//img/productIcons/Grain.png';
            break;
        case "iron":
            url = "https://cdn.e-sim.org//img/productIcons/Iron.png";
            break;
        case "stone":
            url ="https://cdn.e-sim.org//img/productIcons/Stone.png";
            break;
        case "wood":
            url = "https://cdn.e-sim.org//img/productIcons/Wood.png";
            break;
        case "food":
            url = "https://cdn.e-sim.org//img/productIcons/Food.png";
            break;
        case "weapon":
            url = "../img/sword.png";
            break;
        case "ladder":
            url = "../img/ladder.png";
            break;
        case "rollingWood":
            url = "../img/rollingWood.png";
            break;
        case "fallingStone":
            url = "../img/fallingStone.png";
            break;
        case "catapult":
            url = "../img/catapult.png";
            break;
        case "weaponUp":
            url = "../img/weaponUp.png";
            break;
        case "equipUp":
            url = "../img/equipUp.png";
            break;
        case "horseUp":
            url = "../img/horse.png";
            break;
        case "horseSaddleUp":
            url = "../img/horseSaddle.png";
            break;
        case "horseHelmetUp":
            url = "../img/horseHelmet.png";
            break;
        case "gold":
            url = "../img/gold.png";
            break;
        case "weiMoney":
            url = "../img/魏.png";
            break;
        case "shuMoney":
            url = "../img/蜀.png";
            break;
        case "wuMoney":
            url = "../img/吴.png";
            break;
        case "huangMoney":
            url = "../img/黄.png";
            break;
        default:
            url = "../img/catapult.png";
            break;
    }
    return url;
}
