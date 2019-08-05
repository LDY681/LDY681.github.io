$(function(){
    $("#toBattle").on("click",function(e) {
        e.preventDefault();
        toBattle();
    });
});

//跳转到战场链接
function toBattle(){
    var id = getUrlParam('id','Empty');
    window.location.href = "../html/battle.html?id=" + id;
}

//获取城池信息并填充
function evalCity(){
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
        var stone = city.get("stone");
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
        var citystone = $("#stone");
        var citywood = $("#wood");
        cityname.html(cityName);
        cityowner.html(owner);
        cityiron.html(iron);
        cityrice.html(rice);
        citystone.html(stone);
        citywood.html(wood);
        //end of 城池信息框
    }, function(err){
        console.log(err);
    });
}

function evalAdjacent(adjacentCityPanel){
    //修改相邻城池
    var query = new AV.Query('city');
    var cityId = getUrlParam('id','1');
    query.equalTo("cityId", parseInt(cityId, 10));
    query.include(['owner']);
    query.find().then(function(cities) {
        var city = cities[0];
        // 构建 map 的查询
        var query = new AV.Query('map');
        // 查询所有src是city的数据
        query.equalTo('src', city);
        query.include('dest');
        // 执行查询
        var adjacentPanel = {cityData: []};
        query.find().then(function (maps) {
            var cityProcessed = 0;
            maps.forEach(function (mapRow, i, a) {
                var destObj = mapRow.get('dest');
                destObj.fetch({include: ['owner']}).then(function (destObj) {
                    var destCityName = destObj.get('name');
                    var destIsAtWar = destObj.get("isAtWar");
                    var destIron = destObj.get("iron");
                    var destCityId = destObj.get("cityId");
                    var destStone = destObj.get("stone");
                    var destRice = destObj.get("rice");
                    var destWood = destObj.get("wood");
                    var destOwner = destObj.get("owner").get("cname");
                    var destUrl = cityToHref(destCityId);
                    console.log("adjacent city: " + destCityName + " " + destIsAtWar + " " + destIron + " " + destStone + " " + destRice + " " + destWood + " " + destOwner);
                    // handlebars adjacentPanel

                    if (destIsAtWar === false) {
                        destIsAtWar = "风平浪静💖";
                    } else {
                        destIsAtWar = "交战中🔥";
                    }
                    adjacentPanel.cityData.push({
                        destCityName,
                        destIsAtWar,
                        destIron,
                        destStone,
                        destRice,
                        destWood,
                        destOwner,
                        destCityId,
                        destUrl
                    });
                    cityProcessed++;
                    if (cityProcessed === maps.length) {
                        compile(adjacentPanel,adjacentCityPanel);
                    }
                });     //end of  destCity.fetch
            });     //end of destCities.forEach
        });//end of 修改相邻城池
    });
}
function compile(adjacentPanel,adjacentCityPanel){
    $(document).ready(function() {
        console.log("handlebars编译完成");
        var source = $("#adjacentPanelData").html();
        var template = Handlebars.compile(source);
        var html = template(adjacentPanel);
        $(".adjacentDataContainer").html(html);
        console.log("handlebars编译完成");
        var x = document.getElementById(adjacentCityPanel);
        if (x.className.indexOf("w3-hide") !== -1) {
            x.className = x.className.replace("w3-hide", "w3-show");
        }
        var y = $(window).scrollTop();
        $('html, body').animate({ scrollTop: y + 1000 })
    });
}

//通过cityId生成city href
function cityToHref(cityId){
    var cityhtml = "../html/city.html?id=";
    var href = cityhtml + cityId;
    return href;
}





