// populate userMenu的data，由templateXXX.html调用

// handlebars context
var context = {
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

        // handlebars context
        context.userData.push({
            username,
            level,
            exp,
            rank,
            dmg,
            str
        });
        console.log("context.userData[0]信息");
        console.log(context.userData[0]);
        // use handlebars to update html
        var source = $("#userMenuData").html();
        console.log("这里了1");
        var template = Handlebars.compile(source);
        console.log("这里了2");
        var html = template(context);
        console.log("这里了3");
        $(".userMenuDataContainer").html(html);
        console.log("这里了4");
    }).catch(function(error) {
        alert(JSON.stringify(error));
    });
};

