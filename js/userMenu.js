// populate userMenu的data，由templateXXX.html调用

function setupUserData(){
    // handlebars userMenu
    var userMenu = {
        userData: []
    };

    var query = new AV.Query('_User');
    query.include('avatar');
    query.get(AV.User.current().id).then (function (userData){
        var username = userData.get("username");
        var level = userData.get("level");
        var exp = userData.get("exp");
        var rank = userData.get("rank");
        var dmg = userData.get("dmg");
        var str = userData.get("str");
        var avatar = userData.get("avatar");
        var avatarUrl;
        if (avatar){
            // console.log("有avatar");
            avatarUrl = avatar.get("image").get("url");
        }else{
            // console.log("没有avatar");
            avatarUrl = "http://lc-q48bubuw.cn-e1.lcfile.com/18b3144a7e4a7e11b264.png";
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
        // console.log("userMenu.userData[0]信息");
        // console.log(userMenu.userData[0]);

        //如果是work.html,填充work.html的数据
        // if (window.location.href.indexOf("work.html") > -1) {
        // }
        // use handlebars to update html
        $(document).ready(function() {
            // console.log("开始编译userMenu");
            var source = $("#userMenuData").html();
            var template = Handlebars.compile(source);
            var html = template(userMenu);
            $(".userMenuDataContainer").html(html);
            // console.log("完成编译userMenu");
        });
    }).catch(function(error) {
        alert(JSON.stringify(error));
    });
};

