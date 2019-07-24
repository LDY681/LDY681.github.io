$(document).ready(function(){
    $(".sideInfo").hover3d({
        selector: ".country__card"
    });
});

// 战场倒计时(距离整点55分的时间)
function battleCountDown(){
// Set the date we're counting down to
    var currDate = new Date();
    var currHour = currDate.getHours();
    var nextHour = currHour + 1;
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
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Output the result in an element with id="demo"
        document.getElementById("battleCountDown").innerHTML = minutes + "分 " + seconds + "秒 ";

        // If the count down is over, write some text
        if (distance < 0) {
            clearInterval(x);
            document.getElementById("battleCountDown").innerHTML = "活动已结束,敬请期待下期!";
        }
    }, 1000);
}

//刚进入页面时填充战场数据(城市名,防御&进攻国家名称&形象),handlebars一次性编译
function evalBattle() {
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

//玩家输出后,更新数据库[战场offdmg,defdmg;用户totaldmg];更新排行榜(battleId, invaderId, defenderId);更新战场页的伤害显示
function updateDamage(side, damage){
    //更新city的offdmg
    var query = new AV.Query('city');
    var cityId = parseInt(getUrlParam('id', '1'), 10);
    query.equalTo("cityId", cityId);
    query.find().then(function (cities) {
        var city = cities[0];
        if(side === "invader"){
            city.increment('offdmg', damage);

        }else{
            city.increment('defdmg', damage);
        }
        city.save(null, {
            fetchWhenSave: true
        });
    });
    //更新user的总伤害
    var user = AV.User.current();
    user.increment('totalDmg', damage);
    user.save(null, {
        fetchWhenSave: true
    });
    //更新战场总伤,防御方,和每日伤害排行榜
    var battleId = "battle" + cityId;
    var sideId;
    if(side === "invader"){
        sideId = "invader" + cityId;
    }else{
        sideId = "defender" + cityId;
    }
    //更新排行榜数据
    AV.Leaderboard.updateStatistics(AV.User.current(), {
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
    }).catch(console.error);
}

//每5分钟刷新一次排行榜,每15秒刷新一次伤害
function autoUpdate(){
    //刷新排行榜
    updateLeaderBoard();
    //刷新玩家伤害和双方总伤害
    updateDamageStats();

    setInterval(function(){
        updateDamageStats();
    },15000);

    setInterval(function(){
        updateLeaderBoard();
    },300000);

}

//更新玩家伤害,更新战场总伤
function updateDamageStats(){
    //更新用户伤害并显示出来
    updateDamage("invader", 0);
    updateDamage("defender", 0);

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
        invaderTotalDmg.addClass("ld ld-tick");
        setTimeout(function(){invaderTotalDmg.removeClass("ld ld-tick")}, 500);
        defenderTotalDmg.html(defdmg);
        defenderTotalDmg.addClass("ld ld-tick");
        setTimeout(function(){defenderTotalDmg.removeClass("ld ld-tick")}, 500);
    });

}

//更新进攻方Top榜,我的排名;更新防守方Top榜,我的排名
function updateLeaderBoard(){
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

//玩家点击进攻方输出后触发,显示伤害顶部提示,更新伤害
function dealDamageInvaderSide(){

    calculateDamage().then(function(damage){
        //显示伤害
        document.getElementById("damage").innerHTML = damage;
        $(".damageNotifier").show();
        setTimeout(function () {
            $(".damageNotifier").hide();
        }, 800);

        //更新数据
        updateDamage("invader", damage);
    });
}

//玩家点击防御方输出后触发,显示伤害顶部提示,更新伤害
function dealDamageDefenderSide() {
    calculateDamage().then(function(damage){
        //显示伤害
        document.getElementById("damage").innerHTML = damage;
        $(".damageNotifier").show();
        setTimeout(function () {
            $(".damageNotifier").hide();
        }, 800);
        updateDamage("defender", damage);
    });
}

//根据玩家数据和装备计算伤害
async function calculateDamage(){
    let promise = AV.User.current().fetch({include:'equip'}).then(function(res){
        var user = res;
        var equip = user.get('equip');
        //力量
        var str = user.get('str');
        var shield = equip.get('shield');
        var finalStr = str + shield * 100;
        console.log("角色力量:"+str+"; 盾等级:"+shield+"; final力量:"+finalStr);
        //伤害
        var totalDmg = user.get('totalDmg');
        var rank = Math.sqrt(totalDmg/10000);
        var baseDmg = 1000 * (1 + 0.05 * rank);
        var sword = equip.get('sword');
        var finalDmg = baseDmg + sword * 100;
        console.log("总伤害:"+totalDmg+", 军阶:"+rank+"; baseDmg:"+baseDmg+"; sword:"+sword+"; finalDmg:"+finalDmg);
        //伤害区间
        var minModifier = 0.8;
        var maxModifier = 1.2;
        var spear = equip.get('spear');
        var bow = equip.get('bow');
        minModifier = minModifier + (spear * 0.01);
        maxModifier = (maxModifier + (spear * 0.01)) * (1 + bow * 0.02);
        var randomModifier = getRandomArbitrary(minModifier, maxModifier);
        console.log("枪等级:"+spear+", 弓等级:"+bow+"; 伤害区间:"+minModifier+"-"+maxModifier+"; 随机修正结果:"+randomModifier);
        //暴击
        var horseChance = equip.get('horse')*0.02;
        var hiddenChance = equip.get('hidden')*0.01;
        var horseRoll = Math.random();
        var hiddenRoll = Math.random();
        var criticalModifier =1;
        document.getElementById("modifier").innerHTML ="";
        if (horseRoll <= horseChance){
            criticalModifier *= 2;
            document.getElementById("modifier").innerHTML +="【骑】";
        }
        if (hiddenRoll <= hiddenChance){
            criticalModifier *= 5;
            document.getElementById("modifier").innerHTML +="【暗】";
        }
        console.log("horseChance:"+horseChance+", hiddenChance:"+hiddenChance+"; criticalModifier:"+criticalModifier);

        var calculatedDmg = round(finalDmg * (finalStr/1000) * randomModifier * criticalModifier);
        console.log("calculatedDmg: " + calculatedDmg);
        return calculatedDmg;
       },function(err){
        console.log("获取用户信息失败");
    });
    return await promise;
}

//handlebars compile battlePanel 一次性的战场信息(城市,战争方,防御方)
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