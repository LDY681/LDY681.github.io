$(function(){
    $("#toBattle").on("click",function(e) {
        e.preventDefault();
        toBattle();
    });
});

function toBattle(){
    var id = getUrlParam('id','Empty');
    window.location.href = "../html/battle.html?id=" + id;
}

function evalCity(){
    var query = new AV.Query('city');
    var cityId = getUrlParam('id','1');
    query.equalTo("cityId", parseInt(cityId, 10));
    query.include(['owner']);
    query.find().then(function(cities){
        var city = cities[0];
        var isAtWar = city.get("isAtWar");
        var cityName = city.get("name");
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

        var cityPanel = {
            cityData: []
        };

        // handlebars userMenu
        cityPanel.cityData.push({
            cityName,

        });

    }, function(err){
        console.log(err);
    });
}


