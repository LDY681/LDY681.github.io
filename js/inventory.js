function evalInventory(){
    //修改相邻城池
    var user = AV.User.current();
    var itemPanel = {itemData: []};
    var itemList = {};
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
        itemList['gold'] = user.get("gold");
        itemList['weiMoney'] = user.get("weiMoney");
        itemList['shuMoney'] = user.get("shuMoney");
        itemList['wuMoney'] = user.get("wuMoney");
        itemList['huangMoney'] = user.get("huangMoney");

        console.log(itemList);
        for (var item in itemList) {
            console.log(item);
            var itemAmount = parseInt(itemList[item]);
            console.log(itemAmount);
            if (itemAmount !== 0){
                var itemUrl = getItemUrl(item);
                console.log(itemUrl);
                itemPanel.itemData.push({
                    itemAmount,
                    itemUrl
                });
            }
        }
        compile(itemPanel);
    });
}
function compile(itemPanel){
    $(document).ready(function() {
        var source = $("#itemPanel").html();
        var template = Handlebars.compile(source);
        var html = template(itemPanel);
        $(".itemDataContainer").html(html);
    });
}

function getItemUrl(item){
    var url = "";
    switch (item){
        case "iron":
            url = "https://cdn.e-sim.org//img/productIcons/Iron.png";
            break;
        case "rice":
            url ='https://cdn.e-sim.org//img/productIcons/Grain.png';
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