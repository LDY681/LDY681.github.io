$(document).ready(function(){
    $(".sideInfo").hover3d({
        selector: ".country__card"
    });
});

//战场倒计时(距离11:55和23:55的时间)
function battleCountDown(){
// Set the date we're counting down to
    var currDate = new Date();
    var currHour = currDate.getHours();
    var nextHour;
    if (currHour < 12){
        nextHour = 11;
    }else{
        nextHour = 23;
    }
    currDate.setHours(nextHour);
    currDate.setMinutes(55);
    currDate.setSeconds(0);

    var countDownDate = new Date(currDate).getTime();

// Update the count down every 1 second
    var x = setInterval(function() {

        // Get today's date and time
        var now = new Date().getTime();

        // Find the distance between now and the count down date
        var distance = countDownDate - now;

        // Time calculations for days, hours, minutes and seconds
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Output the result in an element with id="demo"
        document.getElementById("battleCountDown").innerHTML = hours + "时 " + minutes + "分 " + seconds + "秒 ";

        // If the count down is over, write some text
        if (distance < 0) {
            clearInterval(x);
            document.getElementById("battleCountDown").innerHTML = "活动已结束,敬请期待下期!";
        }
    }, 1000);
}

//刷新伤害历史倒计时 距离下次攻击还有多久,和nextNMinutes配套使用
function refreshCountDown(){
    var x = setInterval(function() {

        var currDate = new Date();
        var currMinutes = currDate.getMinutes();
        var nextMinutes = currMinutes + 1;
        currDate.setMinutes(nextMinutes);
        currDate.setSeconds(0);
        var countDownDate = new Date(currDate).getTime();
        var now = new Date().getTime();
        var distance = countDownDate - now;
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
        document.getElementById("refreshCountDown").innerHTML = seconds + "秒 ";
        if (distance < 0) {
            clearInterval(x);
            document.getElementById("battleCountDown").innerHTML = "活动已结束,敬请期待下期!";
        }
    }, 1000);
}

//获取下一分钟 例 3分34秒 = 4分0秒
function nextNMinutes(minutes) {
    console.log("nextMinutes运行");
    var currTime = new Date().getTime();
    var nextNMinutesDate = new Date( currTime + minutes*60000-currTime%60000);
    var nextNMinutes = nextNMinutesDate.getMinutes();
    nextNMinutes = nextNMinutes<10?"0"+nextNMinutes:nextNMinutes;
    return nextNMinutesDate.getHours() + ":" + nextNMinutes;
}

//计算可投入战斗的次数 如果战场小于1小时结束，剩余分钟=战斗次数
function calculateWarCount(){
    console.log("calculateWarCount运行");
    var currDate = new Date();
    var currHour = currDate.getHours();
    var currMinute = currDate.getMinutes();
    var warCount = 0;
    //如果可战斗时间小于1小时
    if ( (currHour >=10 && currMinute >55) || (currHour >=22 && currMinute >55) || currHour === 11 || currHour === 23 ){
        var nextHour = Math.floor(currHour/12)*12+11;
        currDate.setHours(nextHour);
        currDate.setMinutes(55);
        currDate.setSeconds(0);

        var countDownDate = new Date(currDate).getTime();
        var now = new Date().getTime();
        // Find the distance between now and the count down date
        var distance = countDownDate - now;

        // Time calculations for days, hours, minutes and seconds
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        // 剩余的分钟数就是可投入战斗次数,当前分钟也算,所以+1
        warCount = minutes + 1;
    }else{
        warCount = 60;
    }
    return warCount;
}

//刚进入页面时填充战场数据(城市名,防御&进攻国家名称&形象)
function evalBattle() {
    console.log("evalBattle运行");
    var query = new AV.Query('city');
    var cityId = parseInt(getUrlParam('id', '1'), 10);
    query.equalTo("cityId", cityId);
    query.include(['owner', 'invader']);

    query.find().then(function (cities) {
        var city = cities[0];
        //获取城池信息
        var isAtWar = city.get("isAtWar");
        //如果当前战场和平,跳转到map.html
        if (isAtWar === false) {
            window.location.href = "../html/map.html";
            return;
        }
        var cityName = city.get("name");
        var invader = city.get('invader');
        var invaderName = invader.get('cname');
        var invaderFigure = invader.get('countryFigure');
        var invaderUrl = invaderFigure.get("url");

        var defender = city.get('owner');
        var defenderFigure = defender.get('countryFigure');
        var defenderName = defender.get('cname');
        var defenderUrl = defenderFigure.get("url");

        localStorage.setItem('currBattle', JSON.stringify({
            cityName,
            invaderName,
            defenderName
        }));

        $("#invaderFigure").attr("src",invaderUrl);
        $("#defenderFigure").attr("src",defenderUrl);
        var battlePanel = {battleData: []};
        battlePanel.battleData.push({
            cityName,
            defenderName,
            invaderName
        });
        compileBattle(battlePanel);
    }, function (err) {
        console.log(err);
    });
}

//,玩家输出后,更新数据库[战场offdmg,defdmg;用户totaldmg];更新排行榜(battleId, invaderId, defenderId);更新战场页的伤害显示
function updateDamage(side, damage, warMessage){
    console.log("updateDamage运行");
    var messagePassed = warMessage || null;
    console.log("messagePassed: "+ messagePassed);
    //更新city的offdmg
    var query = new AV.Query('city');
    var cityId = parseInt(getUrlParam('id', '1'), 10);
    query.equalTo("cityId", cityId);
    return query.find().then(function (cities) {
        var user = AV.User.current();
        var canWar = user.get('canWar');

        //如果伤害不为0,正常输出
        if (damage !== 0){
            //如果canWar=false
            if (canWar === false){
                alert("您已投入战斗!");
            }else{  //如果可以战斗
                user.set('canWar',false);
                var city = cities[0];
                if(side === "invader"){
                    city.increment('offdmg', damage);
                }else{
                    city.increment('defdmg', damage);
                }
                return city.save(null, {
                    fetchWhenSave: true
                }).then(function(){
                    //正常增加totalDamage
                    user.increment('totalDmg', damage);
                    if (messagePassed != null){
                        user.set("warMessage", warMessage);
                    }
                    return user.save(null, {
                        fetchWhenSave: true
                    }).then(function(){
                        return new Promise(function(resolve, reject) {
                            if (JSON.parse(localStorage.getItem('equip')) === undefined){
                                reject(new Error("Equip doesn't exist"));
                            }else{
                                resolve();
                            }
                        });
                    });
                });

            }
        }   //end of if damage != 0

        //更新战场总伤,防御方,和每日伤害排行榜
        var battleId = "battle" + cityId;
        var sideId;
        if(side === "invader"){
            sideId = "invader" + cityId;
        }else{
            sideId = "defender" + cityId;
        }
        //更新排行榜数据
        return AV.Leaderboard.updateStatistics(AV.User.current(), {
            [battleId]: damage,
            [sideId]: damage,
            dailyDamage: damage,
        }).then(function(statistics) {
            if (side === "invader"){
                //更新页面上的伤害显示
                var myInvaderDmg = $("#myInvaderDmg");
                myInvaderDmg.html(statistics[1].value);
                myInvaderDmg.addClass("ld ld-tick");
                setTimeout(function(){myInvaderDmg.removeClass("ld ld-tick")}, 500);
            }else{
                var myDefenderDmg = $("#myDefenderDmg");
                myDefenderDmg.html(statistics[1].value);
                myDefenderDmg.addClass("ld ld-tick");
                setTimeout(function(){myDefenderDmg.removeClass("ld ld-tick")}, 500);
            }
        }, function(err){
            console.log("排行榜更新错误");
            console.log(err);
        });
    });
}

//自动刷新 首次进入战场时加载，并之后每5分钟刷新排行榜和双方总伤
function autoUpdate(){
    console.log("autoUpdate运行");
    updateLeaderBoard();
    updateDamageStats();
    setInterval(function(){
        updateDamageStats();
    },300000);
    setInterval(function(){
        updateLeaderBoard();
    },300000);
}

//更新战场总伤
function updateDamageStats(){
    console.log("updateDamageStats运行");
    //更新用户伤害并显示出来
    var query = new AV.Query('city');
    var cityId = parseInt(getUrlParam('id', '1'), 10);
    query.equalTo("cityId", cityId);
    query.include(['owner', 'invader']);
    query.find().then(function (cities) {
        var city = cities[0];
        var offdmg = city.get('offdmg');
        var defdmg = city.get('defdmg');
        var invaderTotalDmg = $("#invaderTotalDmg");
        var defenderTotalDmg = $("#defenderTotalDmg");
        invaderTotalDmg.html(offdmg);
        defenderTotalDmg.html(defdmg);
    });

}

//更新进攻方Top榜,我的排名;更新防守方Top榜,我的排名
function updateLeaderBoard(){
    console.log("updateLeaderBoard运行");
    var cityId = parseInt(getUrlParam('id', '1'), 10);
    var invaderId = "invader" + cityId;
    var defenderId = "defender" + cityId;

    //更新进攻方排行榜
    var leaderboard = AV.Leaderboard.createWithoutData(invaderId);
    //更新我的排名
    leaderboard.getResultsAroundUser({
        limit: 1,
    }).then(function(users) {
        adjacentRankData.rankDatas = [];
        var itemsProcessed = 0;
        users.forEach(function(user){
            itemsProcessed++;
            var rank = user.rank + 1;
            var damage = user.value;
            adjacentRankData.rankDatas.push({ rank: rank, damage: damage });
        });
    });
    //更新Top排名
    leaderboard.getResults({
        limit: 10,
    }).then(function(users) {
        topRankData.rankDatas = [];
        var itemsProcessed = 0;
        users.forEach(function(user){
            itemsProcessed++;
            var rank = user.rank + 1;
            var damage = user.value;
            topRankData.rankDatas.push({ rank: rank, damage: damage });
        });
    });

    //更新防御方排行榜
    var leaderboardDef = AV.Leaderboard.createWithoutData(defenderId);
    leaderboardDef.getResultsAroundUser({
        limit: 1,
    }).then(function(users) {
        adjacentRankDataDef.rankDatas = [];
        var itemsProcessed = 0;
        users.forEach(function(user){
            itemsProcessed++;
            var rank = user.rank + 1;
            var damage = user.value;
            adjacentRankDataDef.rankDatas.push({ rank: rank, damage: damage });
        });
    });
    //更新Top排名
    leaderboardDef.getResults({
        limit: 10,
    }).then(function(users) {
        topRankDataDef.rankDatas = [];
        var itemsProcessed = 0;
        users.forEach(function(user){
            itemsProcessed++;
            var rank = user.rank + 1;
            var damage = user.value;
            topRankDataDef.rankDatas.push({ rank: rank, damage: damage });
        });
    });
}

//点开InvaderModal
function openInvaderModal(){
    console.log("openInvaderModal运行");
    $("#invaderModal").show();
}

//点开InvaderModal
function openDefenderModal(){
    console.log("openDefenderModal运行");
    $("#defenderModal").show();
}

//刚进入战场时加载，判断是否可以战斗，并把warMessage更新到本地
function evalCanWar(){
    console.log("evalCanWar 运行");
    var user = AV.User.current();

    user.fetch().then(function(user){
        var canWar = user.get("canWar");
        console.log(canWar);
        var warNotifier = $(".warNotifier");
        var onWar = $(".onWar");
        var warMessage = user.get("warMessage");

        if (canWar === false ){
            warNotifier.html( "已投入战斗!" );
            onWar.hide();
            $(".alreadyAtWar").show();
        }else {
            warNotifier.html( "快快加入战争!" );
            onWar.show();
            onWar.html( "点我投入战斗!" );
            onWar.addClass("w3-red");
            $(".alreadyAtWar").hide();
        }
        $(".workntrainButton").show();
        localStorage.setItem('warMessage', JSON.stringify({warMessage}));
    });
}
//TODO 玩家点击进攻方输出后触发,显示伤害顶部提示,更新伤害
function dealDamageInvaderSide(){
    console.log("dealDamageInvaderSide 运行");
    var currBattle = localStorage.getItem("currBattle");
    var cityName = JSON.parse(currBattle).cityName;
    var invaderName = JSON.parse(currBattle).invaderName;

    localStorage.setItem('battleParticipated', JSON.stringify({
        cityName,
        invaderName
    }));
    //计算距离双整点的时间,判断可以攻击几次
    var warCount = calculateWarCount();
    console.log(warCount);
    var warMessage = [];
    var totalDamage = 0;
    var coeff = 1000 * 60;
    var now = new Date().getTime();
    var updateAt = Math.floor( now / coeff) * coeff;
    console.log(updateAt);
    warMessage.push(updateAt);
    for (var i = 1; i <= warCount+1; i++){
        var damageInfo = calculateDamage();
        var performance = damageInfo.pop();
        var damage = damageInfo.pop();
        totalDamage +=damage;
        warMessage.push( nextNMinutes(i-1) + " " + "在" +cityName+"攻城战中，" + performance);
    }
    localStorage.setItem('warMessage', JSON.stringify({warMessage}));
    //更新数据
    updateDamage("invader", totalDamage, warMessage).then(function(){
        document.location.reload();
    });
}

//TODO 玩家点击防御方输出后触发,显示伤害顶部提示,更新伤害
function dealDamageDefenderSide() {
    console.log("dealDamageDefenderSide 运行");
    var currBattle = localStorage.getItem("currBattle");
    var cityName = JSON.parse(currBattle).cityName;
    var defenderName = JSON.parse(currBattle).defenderName;

    localStorage.setItem('battleParticipated', JSON.stringify({
        cityName,
        defenderName
    }));
    //计算距离双整点的时间,判断可以攻击几次
    var warCount = calculateWarCount();
    var warMessage = [];
    var totalDamage = 0;
    warMessage.push(new Date());
    for (var i = 1; i <= warCount+1; i++){
        var damage = calculateDamage();
        totalDamage +=damage;
        warMessage.push( nextNMinutes(i-1) + " " + "在" +cityName+"争夺战中,为"+defenderName+"输出"+damage+"点伤害");
    }
    localStorage.setItem('warMessage', JSON.stringify({warMessage}));

    //更新数据
    updateDamage("defender", totalDamage).then(function(){
        document.location.reload();
    });
}

//TODO 根据玩家数据和装备计算伤害
function calculateDamage(){
    console.log("calculateDamage 运行");
        var user = AV.User.current();
        var equip = localStorage.getItem("equip");
        //力量
        var str = user.get('str');
        var helmet = JSON.parse(equip).helmet;
        var armor = JSON.parse(equip).armor;
        var shoes = JSON.parse(equip).shoes;
        var offhand = JSON.parse(equip).offhand;
        var shield = JSON.parse(equip).shield;
        var sword = JSON.parse(equip).sword;
        var spear = JSON.parse(equip).spear;
        var bow = JSON.parse(equip).bow;
        var horseHelmet = JSON.parse(equip).horseHelmet;
        var horseSaddle = JSON.parse(equip).horseSaddle;
        var horse = JSON.parse(equip).horse;
        var finalStr = str + (helmet + armor + shoes + offhand) * 100;

        //连击
        var damage = 0;
        var hitAgain = false;
        var damageInfo =[];
        var totalPerformance = "";
        do{
            var performance = "";
            //伤害
            var totalDmg = user.get('totalDmg');
            var rank = Math.sqrt(totalDmg/10000);
            var baseDmg = 1000 * (1 + 0.05 * rank);
            var finalDmg = baseDmg + sword * 100;

            //伤害区间
            var minModifier = 0.8;
            var maxModifier = 1.2;
            minModifier = minModifier + (spear * 0.01);
            maxModifier = (maxModifier + (spear * 0.01)) * (1 + bow * 0.02);
            var randomModifier = getRandomArbitrary(minModifier, maxModifier);

            //暴击
            var horseHelmetRoll = Math.random();
            var horseSaddleRoll = Math.random();
            var horseHelmetChance = horseHelmet * 0.05;
            var horseSaddleChance = horseSaddle * 0.05;
            var criticalModifier =1;
            document.getElementById("modifier").innerHTML ="";

            if (horseHelmetRoll <= horseHelmetChance){
                criticalModifier *= 2;
                performance += "冲锋陷阵，";
            }
            if (horseSaddleRoll <= horseSaddleChance){
                criticalModifier *= 5;
                performance += "一骑当千，";
            }
            if (criticalModifier === 1){
                performance += "表现平平，";
            }

            //失误
            var missModifier =1;
            var shieldRoll = Math.random();
            var shieldRollChance = 0.1 -shield * 0.01;
            if (shieldRoll <= shieldRollChance){
                missModifier = 0;
                performance = "摔下城墙，";
            }

            //连击
            hitAgain = false;
            var horseRoll = Math.random();
            var horseRollChance = horse * 0.05;
            var currDamage = round(finalDmg * (finalStr / 1000) * randomModifier * criticalModifier) * missModifier;
            damage += currDamage;
            if (horseRoll <= horseRollChance){
                performance += "血战不息，";
                hitAgain = true;
            }

            performance += "您" + performance +"造成"+currDamage+"点伤害。";
            totalPerformance +=performance;
        }while(hitAgain === true);

        console.log(performance + damage);
        damageInfo.push(damage);
        damageInfo.push(performance);
        return damageInfo;
}

//TODO handlebars compile battlePanel 一次性的战场信息(城市,战争方,防御方)
function compileBattle(battlePanel){
    $(document).ready(function() {
        var source = $("#battlePanelData").html();
        var template = Handlebars.compile(source);
        var html = template(battlePanel);
        $(".battleDataContainer").html(html);
    });
}

//vue 组件
var adjacentRankData = new Vue({
    el: '#adjacentRankData',
    data: {
        rankDatas: []
    }
});
var adjacentRankDataDef = new Vue({
    el: '#adjacentRankDataDef',
    data: {
        rankDatas: []
    }
});
var topRankData = new Vue({
    el: '#topRankData',
    data: {
        rankDatas: []
    }
});
var topRankDataDef = new Vue({
    el: '#topRankDataDef',
    data: {
        rankDatas: []
    }
});


function loadSheet() {
    console.log("loadSheet 运行");
    var x = setInterval(function() {
    var user = AV.User.current();
    //var loadedData = JSON.parse(localStorage.getItem("tblArrayJson"));
    var loadedTable = document.getElementById("SpreadsheetTable");
    $("#tableBody").empty();
    var warMessageContainer = localStorage.getItem("warMessage");
    var warMessage = JSON.parse(warMessageContainer);
    var msgArray = warMessage.warMessage;

    // Get today's date and time
    var now = new Date().getTime();
    var updateAt = msgArray[0];
    // Find the distance between now and the count down date
    var distance = now - updateAt;
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = days * 24 * 60 + hours * 60 + Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    // console.log("距离上次攻击多少分钟：" + minutes);
    var isAtWar = true;
    for (var i = 1; i < msgArray.length && i <= minutes + 1; i++) {
        var row = loadedTable.insertRow(0);
        var cell = row.insertCell(0);
        cell.innerHTML = msgArray[i];

        //如果i == msgArray.length-1 如果战斗完了，那么交战中变成战斗历史
        if (i === msgArray.length -1){
            console.log("整个数组读完了");
            isAtWar = false;
            $("#refreshBox").hide();
            $("#messageTitle").removeClass("w3-red").html("伤害历史");
            $("#messageGif").attr("src","../img/snore.png").addClass("ld ld-breath");
        }
    }

        if (user.get("canWar") === false && isAtWar === true){ //如果交战中
            $("#refreshBox").show();
            $("#messageTitle").removeClass("w3-black").addClass("w3-red").html("交战中");
            $("#messageGif").attr("src","../img/gear.gif").removeClass("ld ld-breath");

        }else{  //如果不在交战中
            $("#refreshBox").hide();
            $("#messageTitle").removeClass("w3-red").html("伤害历史");
            $("#messageGif").attr("src","../img/snore.png").addClass("ld ld-breath");
        }

    },1000);
}
loadSheet();
