// populate userMenu的data，由templateXXX.html调用

function setupUserData(){
    // handlebars userMenu
    var userMenu = {
        userData: []
    };

    var query = new AV.Query('_User');
    query.include('avatar');
    query.get(AV.User.current().id).then (function (userData){
        console.log("userMenu userData信息");
        console.log(userData);
        var username = userData.get("username");
        var level = userData.get("level");
        var exp = userData.get("exp");
        var rank = userData.get("rank");
        var dmg = userData.get("dmg");
        var str = userData.get("str");
        var avatar = userData.get("avatar").get("image");
        var avatarUrl;
        if (avatar){
            avatarUrl = avatar.get("url");
        }else{
            avatarUrl = "../img/logo.png";
        }
        // handlebars userMenu
        userMenu.userData.push({
            username,
            level,
            exp,
            rank,
            dmg,
            str,
            avatarUrl
        });
        console.log("userMenu.userData[0]信息");
        console.log(userMenu.userData[0]);

        //如果是work.html,填充work.html的数据
        // if (window.location.href.indexOf("work.html") > -1) {
        // }
        // use handlebars to update html
        var source = $("#userMenuData").html();
        var template = Handlebars.compile(source);
        var html = template(userMenu);
        $(".userMenuDataContainer").html(html);
    }).catch(function(error) {
        alert(JSON.stringify(error));
    });
};

