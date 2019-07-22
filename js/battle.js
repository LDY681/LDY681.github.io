$(document).ready(function(){
    $(".sideInfo").hover3d({
        selector: ".country__card"
    });
});

// 活动倒计时
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

//刚进入页面时填充战场数据
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
        var offdmg = city.get('offdmg');
        var invaderUrl = invaderFigure.get("url");

        var defender = city.get('owner');
        var defenderFigure = defender.get('countryFigure');
        var defenderName = defender.get('cname');
        var defdmg = city.get('defdmg');
        var defenderUrl = defenderFigure.get("url");

        $("#invaderFigure").attr("src",invaderUrl);
        $("#defenderFigure").attr("src",defenderUrl);
        var battlePanel = {battleData: []};
        battlePanel.battleData.push({
            cityName,
            defdmg,
            offdmg,
            defenderName,
            invaderName
        });

        compileBattle(battlePanel);

    }, function (err) {
        console.log(err);
    });

}

function compileBattle(battlePanel){
    $(document).ready(function() {
        var source = $("#battlePanelData").html();
        var template = Handlebars.compile(source);
        var html = template(battlePanel);
        $(".battleDataContainer").html(html);
    });
}
function compileRank(adjacentRankPanel){
    console.log("这里了");
    console.log(adjacentRankPanel);
    $(document).ready(function() {
        var source = $("#adjacentRankPanelData").html();
        var template = Handlebars.compile(source);
        var html = template(adjacentRankPanel);
        $(".adjacentRankDataContainer").html(html);
    });
}
function compileRankDef(adjacentRankPanelDef){
    console.log("这里了");
    console.log(adjacentRankPanelDef);
    $(document).ready(function() {
        var source = $("#adjacentRankPanelDataDef").html();
        var template = Handlebars.compile(source);
        var html = template(adjacentRankPanelDef);
        $(".adjacentRankDataContainerDef").html(html);
    });
}

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

    var adjacentRankPanel = {rankData: []};
    var adjacentRankPanelDef = {rankDataDef: []};
    AV.Leaderboard.updateStatistics(AV.User.current(), {
        [battleId]: damage,
        [sideId]: damage,
        dailyDamage: damage,
    }).then(function(statistics) {
        if (side === "invader"){
            //更新伤害显示
            $("#myInvaderDmg").html(statistics[1].value);
            //更新排名显示
            var leaderboard = AV.Leaderboard.createWithoutData(sideId);
            leaderboard.getResultsAroundUser({
                limit: 5,
            }).then(function(users) {
                users.forEach(function(user){
                    var rank = user.rank + 1;
                    var damage = user.value;
                    adjacentRankPanel.rankData.push({
                        rank,
                        damage
                    });
                });
            }).then(function(){
                compileRank(adjacentRankPanel);
            });
        }else{
            $("#myDefenderDmg").html(statistics[1].value);
            var leaderboardDef = AV.Leaderboard.createWithoutData(sideId);
            leaderboardDef.getResultsAroundUser({
                limit: 5,
            }).then(function(users) {
                users.forEach(function(user){
                    var rankDef = user.rank + 1;
                    var damageDef = user.value;
                    adjacentRankPanelDef.rankDataDef.push({
                        rankDef,
                        damageDef
                    });
                });
            }).then(function(){
                compileRankDef(adjacentRankPanelDef);
            });
        }
    }).catch(console.error);
}

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
