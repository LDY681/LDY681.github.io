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

function evalBattle(){
    var query = new AV.Query('city');
    var cityId = getUrlParam('id','1');
    query.equalTo("cityId", parseInt(cityId, 10));
    query.include(['owner']);
    query.find().then(function(cities){
        var city = cities[0];

        //获取城池信息
        var isAtWar = city.get("isAtWar");
        var cityName = city.get("name");
        var iron = city.get("iron");
        var wheat = city.get("wheat");
        var rice = city.get("rice");
        var wood = city.get("wood");
        var owner = city.get("owner").get("cname");

        //修改战争状态框
        var battleNotifier = $("#battleNotifier");
        var toBattle = $("#toBattle");
        if (isAtWar === false){
            battleNotifier.html( cityName + "当前处于和平状态" );
            battleNotifier.addClass("w3-text-green");
            toBattle.html( "好嘞(●'◡'●)" );
            toBattle.attr("disabled", true);
            toBattle.removeClass("w3-green");
            toBattle.addClass("w3-grey");
        } else{
            battleNotifier.html( cityName + "正在争夺中!" );
            battleNotifier.addClass("w3-text-red");
            toBattle.html( "快快进入战场!" );
            toBattle.addClass("w3-red");
        }
        $(".workntrainButton").show();
        //end of 修改战争状态框

        //修改城池信息框
        var cityname = $("#name");
        var cityowner = $("#owner");
        var cityiron = $("#iron");
        var cityrice = $("#rice");
        var citywheat = $("#wheat");
        var citywood = $("#wood");
        cityname.html(cityName);
        cityowner.html(owner);
        cityiron.html(iron);
        cityrice.html(rice);
        citywheat.html(wheat);
        citywood.html(wood);
        //end of 城池信息框

        //修改相邻城池
        // 构建 map 的查询
        var query = new AV.Query('map');
        // 查询所有src是city的数据
        query.equalTo('src', city);
        query.include('dest');
        // 执行查询
        var battlePanel = {battleData: []};
        query.find().then(function (maps) {
            var cityProcessed = 0;
            maps.forEach(function (mapRow, i, a) {
                var destObj = mapRow.get('dest');
                destObj.fetch({ include: ['owner'] }).then(function (destObj) {
                    var destCityName = destObj.get('name');
                    var destIsAtWar = destObj.get("isAtWar");
                    var destIron = destObj.get("iron");
                    var destCityId = destObj.get("cityId");
                    var destWheat = destObj.get("wheat");
                    var destRice = destObj.get("rice");
                    var destWood = destObj.get("wood");
                    var destOwner = destObj.get("owner").get("cname");
                    var destUrl = cityToHref(destCityId);
                    console.log("adjacent city: " +destCityName +" "+ destIsAtWar +" "+ destIron+" "+ destWheat+" " + destRice +" "+ destWood+" "+destOwner);
                    // handlebars adjacentPanel

                    if (destIsAtWar === false){
                        destIsAtWar = "风平浪静💖";
                    }else{
                        destIsAtWar = "交战中🔥";
                    }
                    battlePanel.battleData.push({
                        destCityName,
                        destIsAtWar,
                        destIron,
                        destWheat,
                        destRice,
                        destWood,
                        destOwner,
                        destCityId,
                        destUrl
                    });
                    cityProcessed++;
                    if (cityProcessed === maps.length){
                        compile(battlePanel);
                    }
                });     //end of  destCity.fetch
            });     //end of destCities.forEach
        });//end of 修改相邻城池
    }, function(err){
        console.log(err);
    });
}

function compile(adjacentPanel){
    $(document).ready(function() {
        console.log("handlebars编译完成");
        var source = $("#battlePanelData").html();
        var template = Handlebars.compile(source);
        var html = template(battlePanel);
        $(".battleDataContainer").html(html);
        console.log("handlebars编译完成");
    });
}