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
        var canWar = userData.get("canWar");
        var canTrain = userData.get("canTrain");
        var canWork = userData.get("canWork");
        var trainCount = userData.get("trainCount");
        var workCount = userData.get("workCount");
        var taskCompleted = 3;
        if (canWar === true){
            $("#taskButtonFight").css("display","inline-block");
            taskCompleted --;
        }
        if (canTrain === true &&  trainCount !== 4){
            $("#taskButtonTrain").css("display","inline-block");
            taskCompleted --;
        }
        if (canWork === true &&  workCount !== 4){
            $("#taskButtonWork").css("display","inline-block");
            taskCompleted --;
        }
        if (taskCompleted === 3){
            $("#taskAllCompleted").css("display","inline-block");
        }
        var avatarUrl = JSON.parse(localStorage.getItem("avatarUrl")).avatarUrl;
        userMenu.userData.push({
            username,
            level,
            exp,
            rank,
            dmg,
            str,
            avatarUrl
        });

        $(document).ready(function() {
            // console.log("开始编译userMenu");
            var source = $("#userMenuData").html();
            var template = Handlebars.compile(source);
            var html = template(userMenu);
            $(".userMenuDataContainer").html(html);
        });

};

