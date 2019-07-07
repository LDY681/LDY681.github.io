// populate userMenu的data，由templateXXX.html调用

// handlebars userMenu
var userMenu = {
    userData: []
};

function setupUserData(){
    var query = new AV.Query('_User');
    query.get(AV.User.current().id).then (function (userData){
        console.log("userMenu userData信息");
        console.log(userData);
        var username = userData.get("username");
        var level = userData.get("level");
        var exp = userData.get("exp");
        var rank = userData.get("rank");
        var dmg = userData.get("dmg");
        var str = userData.get("str");

        // handlebars userMenu
        userMenu.userData.push({
            username,
            level,
            exp,
            rank,
            dmg,
            str
        });
        console.log("userMenu.userData[0]信息");
        console.log(userMenu.userData[0]);
        // use handlebars to update html
        var source = $("#userMenuData").html();
        console.log("这里了1");
        var template = Handlebars.compile(source);
        var html = template(userMenu);
        console.log("这里了3");
        $(".userMenuDataContainer").html(html);
        console.log("这里了4");
    }).catch(function(error) {
        alert(JSON.stringify(error));
    });
};

