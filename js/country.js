var cityDataString = $("#cityData").html();

$(function(){
    evalCountry();
    $("#declareWar").on("click", function(){
        declareWar();
    });
});

//当国家选好后 ->寻找可宣战的相邻城市并显示在城市列表中
function countrySelected(event) {
    var countryName = event.target.value;
    console.log("国家名为: " + countryName);

    var cityPanel = {
        cityData: []
    };

    //获取国家obj
    var countryObj;
    var countryQuery = new AV.Query('country');
    countryQuery.equalTo('name', countryName);
    countryQuery.find().then(function (countries) {
        console.log(countries);
        countryObj = countries[0];

        var declarables = countryObj.get("declarables");
        for (var declarable in declarables) {
            var cityName = declarables[declarable];
            console.log(cityName);
            cityPanel.cityData.push({
                cityName
            });
        }
        compileCityPanel(cityPanel);
    });
}

function compileCityPanel(cityPanel){
    $(document).ready(function(){
        var template = Handlebars.compile(cityDataString);
        var html = template(cityPanel);
        $(".cityDataContainer").html(html);
    });
}

//当城市选好后,enable宣战按钮
function citySelected(event) {
    var emperorQuery = new AV.Query(AV.Role);
    // 查询当前用户拥有的角色
    emperorQuery.equalTo('name', "emperor");
    emperorQuery.equalTo('users', AV.User.current());

    var cabinetQuery = new AV.Query(AV.Role);
    // 查询当前用户拥有的角色
    cabinetQuery.equalTo('name', "cabinet");
    cabinetQuery.equalTo('users', AV.User.current());

    var roleQuery = AV.Query.or(emperorQuery, cabinetQuery);
    var canDeclareWar = true;
    roleQuery.find().then(function(roles) {
        if (roles.length === 0) {
            alert("只有皇帝,大臣才可以宣战!");
            canDeclareWar = false;
            return;
        }
    }, function (error) {
        alert("加载失败,请刷新!");
        return;
    });
    if (canDeclareWar === false){return;}
    document.getElementById("warReminder").style.display = "block";
    document.getElementById("warReminder").innerHTML = "宣战费用为500本国货币";
    document.getElementById("declareWar").disabled = false;
    document.getElementById("declareWar").classList.remove("w3-gray");
    document.getElementById("declareWar").classList.add("w3-green");
}

function declareWar(){
    var countrySelect = document.getElementById("country");
    var invader = countrySelect.options[countrySelect.selectedIndex].value;
    var citySelect = document.getElementById("city");
    var cityName = citySelect.options[citySelect.selectedIndex].value;

    console.log("进攻国家: " + invader + " 进攻城池: " + cityName);
    //获取进攻国家对象
    var invaderObj;
    var countryQuery = new AV.Query('country');
    countryQuery.equalTo('name', invader);
    countryQuery.find().then(function(countries){
        invaderObj = countries[0];
        console.log("进攻国家"+invaderObj.attributes.cname);
        //获取城市信息
        var cityQuery = new AV.Query('city');
        cityQuery.equalTo('name', cityName);
        cityQuery.include(['owner']);
        cityQuery.find().then(function(cities){
            var city = cities[0];
            var warPending = city.get('warPending');
            var owner = city.get('owner');

            //如果warPending = null 并且城市所有者不等于进攻方
            if ( (warPending === undefined) && owner.get('name') !== invaderObj.get('name')){
                city.set('warPending', invaderObj);
                return city.save().then(function(res){
                    var hours = new Date().getHours();
                    if (hours < 12){
                        alert("宣战成功!战场将在12点开启!");
                    }else{
                        alert("宣战成功!战场将在24点开启!");
                    }
                    document.getElementById("declareWar").disabled = true;
                    document.getElementById("declareWar").classList.remove("w3-green");
                    document.getElementById("declareWar").classList.add("w3-gray");
                }, function(err){
                    alert("宣战失败");
                });
            }else if (warPending !== undefined){
                alert("当前城池已被宣战!");
            }else {
                alert("当前城池已属于您的势力!");
            }
        });
    });
}

function evalCountry(){
    var query = new AV.Query('country');
    var countryId = getUrlParam('id','1');
    query.equalTo("countryId", parseInt(countryId, 10));
    query.find().then(function(countries){
        var country = countries[0];

        //获取城池信息
        var countryName = country.get("cname");
        var iron = country.get("iron");
        var stone = country.get("stone");
        var rice = country.get("rice");
        var wood = country.get("wood");
        var occupied = country.get("occupied");
        var cityCount = country.get("cityCount");
        var citizenCount = country.get("citizenCount");
        var battleModifier = ((country.get("battleModifier")-1)*100).toFixed(1  );
        //修改城池信息框
        $("#name").html(countryName);
        $("#citizenCount").html(citizenCount);
        $("#cityCount").html(cityCount + "城");
        $("#cityList").html(occupied.join(" "));
        $("#iron").html(iron);
        $("#stone").html(stone);
        $("#rice").html(rice);
        $("#wood").html(wood);
        $("#battleModifier").html(battleModifier);
        //end of 城池信息框
    }, function(err){
        console.log(err);
    });
}
