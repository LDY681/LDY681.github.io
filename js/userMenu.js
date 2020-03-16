// populate userMenu的data，由templateXXX.html调用
var userData;
function setupUserData(){
    var whichUser = getUrlParam("profile",-1);
    if (whichUser !== -1){
        var currUser = AV.User.current();
        if (whichUser === currUser.get("username")){
            populateUserData(currUser, false);
        }else{
            var paramsJson = {
                username: whichUser
            };
            AV.Cloud.run('findUser', paramsJson).then(function (user) {
                console.log("找到user");
                //console.log(user);
                populateUserData(user, true);
            }).catch(function(err){
                let errorMsg = err.toString().split("[");
                alert(errorMsg[0]);
            });
        }
    }else{
        var user = AV.User.current();
        populateUserData(user, false);
    }
};

function populateUserData(UserData, isOtherUser){
    // handlebars userMenu
    var userMenu = {
        userData: []
    };
    userData = UserData;
    console.log(userData);
    var username = isOtherUser? userData.username: userData.get("username");
    var level = isOtherUser? userData.level:userData.get("level");
    var exp = isOtherUser? userData.exp: userData.get("exp");
    var rank = isOtherUser? userData.rank: userData.get("rank");
    var dmg = isOtherUser? userData.totalDmg: userData.get("totalDmg");
    var str = isOtherUser? userData.str: userData.get("str");
    var eco = (isOtherUser? userData.ecoSkill: userData.get("ecoSkill")).toFixed(2);
    var canWar = isOtherUser? userData.canWar: userData.get("canWar");
    var canTrain = isOtherUser? userData.canTrain: userData.get("canTrain");
    var canWork = isOtherUser? userData.canWork: userData.get("canWork");
    var trainCount = isOtherUser? userData.trainCount: userData.get("trainCount");
    var workCount = isOtherUser? userData.workCount: userData.get("workCount");
    var objectId = isOtherUser? userData.objectId: userData.get("objectId");
    var taskCompleted = 3;

    if (!isOtherUser){
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
            $("#taskAllCompleted").html( "全部完成!");
        }
    }else{
        $(".hideWhenSearch").hide();
    }

    var avatarUrl = JSON.parse(localStorage.getItem("avatarUrl")).avatarUrl;
    userMenu.userData.push({
        username,
        level,
        exp,
        rank,
        dmg,
        str,
        avatarUrl,
        eco
    });

    $(document).ready(function() {
        // console.log("开始编译userMenu");
        var source = $("#userMenuData").html();
        var template = Handlebars.compile(source);
        var html = template(userMenu);
        $(".userMenuDataContainer").html(html);
    });
}

