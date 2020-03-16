function evalInventory(){
    //修改相邻城池
    var user = AV.User.current();
    var itemPanel = {itemData: []};
    var moneyPanel = {moneyData: []};
    var itemList = {};
    var moneyList = {};
    user.fetch().then(function (user) {
        //product
        itemList['rice'] = user.get("rice");
        itemList['iron'] = user.get('iron');
        itemList['wood']  = user.get("wood");
        itemList['stone'] = user.get("stone");

        itemList['food'] = user.get("food");
        itemList['weapon'] = user.get("weapon");
        itemList['rollingWood'] = user.get("rollingWood");
        itemList['ladder'] = user.get("ladder");
        itemList['fallingStone'] = user.get("rollingWood");
        itemList['catapult'] = user.get("catapult");

        //item
        itemList['weaponUp'] = user.get("weaponUp");
        itemList['equipUp'] = user.get("equipUp");
        itemList['horseHelmetUp'] = user.get("horseHelmetUp");
        itemList['horseSaddleUp'] = user.get("horseSaddleUp");
        itemList['horseUp'] = user.get("horseUp");

        //money
        moneyList['gold'] = user.get("gold");
        moneyList['weiMoney'] = user.get("weiMoney");
        moneyList['shuMoney'] = user.get("shuMoney");
        moneyList['wuMoney'] = user.get("wuMoney");
        moneyList['huangMoney'] = user.get("huangMoney");

        for (var item in itemList) {
            console.log(item);
            var itemAmount = parseInt(itemList[item]);
            console.log(itemAmount);
            if (itemAmount !== 0){
                console.log("itemAmount is : " + itemAmount);
                var itemUrl = getItemUrl(item);
                var citem = translator(item);
                itemPanel.itemData.push({
                    citem,
                    itemAmount,
                    itemUrl
                });
            }
        }
        for (var money in moneyList) {
            console.log(money);
            var moneyAmount = parseInt(moneyList[money]);
            console.log(moneyAmount);
            if (moneyAmount !== 0){
                console.log("moneyAmount is : " + moneyAmount);
                var moneyUrl = getItemUrl(money);
                var cmoney = translator(money);
                moneyPanel.moneyData.push({
                    cmoney,
                    moneyAmount,
                    moneyUrl
                });
            }
        }
        compile(itemPanel,"item");
        compile(moneyPanel, "money");
    });
}
function compile(itemPanel, itemOrMoney){
    $(document).ready(function() {
        if (itemOrMoney === "item"){
            var source = $("#itemPanel").html();
            var template = Handlebars.compile(source);
            var html = template(itemPanel);
            $(".itemDataContainer").html(html);
        }else{
            var source = $("#moneyPanel").html();
            var template = Handlebars.compile(source);
            var html = template(itemPanel);
            $(".moneyDataContainer").html(html);
        }

    });
}

function getItemUrl(item){
    var url = "";
    switch (item){
        case "rice":
            url ='https://cdn.e-sim.org//img/productIcons/Grain.png';
            break;
        case "iron":
            url = "https://cdn.e-sim.org//img/productIcons/Iron.png";
            break;
        case "stone":
            url ="https://cdn.e-sim.org//img/productIcons/Stone.png";
            break;
        case "wood":
            url = "https://cdn.e-sim.org//img/productIcons/Wood.png";
            break;
        case "food":
            url = "https://cdn.e-sim.org//img/productIcons/Food.png";
            break;
        case "weapon":
            url = "../img/sword.png";
            break;
        case "ladder":
            url = "../img/ladder.png";
            break;
        case "rollingWood":
            url = "../img/rollingWood.png";
            break;
        case "fallingStone":
            url = "../img/fallingStone.png";
            break;
        case "catapult":
            url = "../img/catapult.png";
            break;
        case "weaponUp":
            url = "../img/weaponUp.png";
            break;
        case "equipUp":
            url = "../img/equipUp.png";
            break;
        case "horseUp":
            url = "../img/horse.png";
            break;
        case "horseSaddleUp":
            url = "../img/horseSaddle.png";
            break;
        case "horseHelmetUp":
            url = "../img/horseHelmet.png";
            break;
        case "gold":
            url = "../img/gold.png";
            break;
        case "weiMoney":
            url = "../img/魏.png";
            break;
        case "shuMoney":
            url = "../img/蜀.png";
            break;
        case "wuMoney":
            url = "../img/吴.png";
            break;
        case "huangMoney":
            url = "../img/黄.png";
            break;
        default:
            url = "../img/catapult.png";
            break;
    }
    return url;
}
