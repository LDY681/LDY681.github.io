// populate userMenu的data，由templateXXX.html调用

function setupUserData(){
    // handlebars userMenu
    var userMenu = {
        userData: []
    };

    var userData = AV.User.current();
        var username = userData.get("username");
        var level = userData.get("level");
        var exp = userData.get("exp");
        var rank = userData.get("rank");
        var dmg = userData.get("totalDmg");
        var str = userData.get("str");
        var avatarUrl = JSON.parse(localStorage.getItem("avatarUrl")).avatarUrl;
        console.log(avatarUrl);
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

        $(document).ready(function() {
            // console.log("开始编译userMenu");
            var source = $("#userMenuData").html();
            var template = Handlebars.compile(source);
            var html = template(userMenu);
            $(".userMenuDataContainer").html(html);
            // console.log("完成编译userMenu");
        });

};

