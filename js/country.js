
$(function(){

    $("#declareWar").on("click", function(){
        declareWar();
    });
});

// 宣战,下个整点55分钟开战
function declareWar(){
    var select = document.getElementById("country");
    var invader = select.options[select.selectedIndex].value;
    var cityId = parseInt(document.getElementById("cityId").value);
    console.log("进攻国家: " + invader + " 进攻城池ID" + cityId);
    //获取进攻国家对象
    var invaderObj;
    var countryQuery = new AV.Query('country');
    countryQuery.equalTo('name', invader);
    countryQuery.find().then(function(countries){
        invaderObj = countries[0];
        console.log("进攻国家"+invaderObj.attributes.cname);
        //获取城市信息
        var cityQuery = new AV.Query('city');
        cityQuery.equalTo('cityId', cityId);
        cityQuery.include(['owner']);
        cityQuery.find().then(function(cities){
            var city = cities[0];
            var warPending = city.get('warPending');
            var owner = city.get('owner');

            //如果warPending = null 并且城市所有者不等于进攻方
            if ( (warPending === undefined) && owner.get('name') !== invaderObj.get('name')){
                city.set('warPending', invaderObj);
                return city.save().then(function(res){
                    alert("宣战成功!下个整点战场开启!");
                }, function(err){
                    alert("宣战失败");
                });
            }else if (warPending !== undefined){
                alert("warPending值已defined,当前城池已被宣战!");
            }else {
                alert("当前城池已属于您的势力!");
            }

        });
    });
}
