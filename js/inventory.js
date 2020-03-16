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


