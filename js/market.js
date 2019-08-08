var selectedProduct = "";
//查询 选择商品
$(function(){
    $("#rice").click(function(){
        selectedProduct = "rice";
        $.notify("新鲜的大米哟!",{position:"top-center", className: "success"});
    });
    $("#iron").click(function(){
        selectedProduct = "iron";
        $.notify("上等的生铁哟!",{position:"top-center", className: "success"});
    });
    $("#wood").click(function(){
        selectedProduct = "wood";
        $.notify("上等的原木哟!",{position:"top-center", className: "success"});
    });
    $("#stone").click(function(){
        selectedProduct = "stone";
        $.notify("高质的粗石哟!",{position:"top-center", className: "success"});
    });
    $("#food").click(function(){
        selectedProduct = "food";
        $.notify("新鲜的军粮哟!",{position:"top-center", className: "success"});
    });
    $("#weapon").click(function(){
        selectedProduct = "weapon";
        $.notify("上好的兵器哟!",{position:"top-center", className: "success"});
    });
    $("#rollingWood").click(function(){
        selectedProduct = "rollingWood";
        $.notify("上好的滚木哟!",{position:"top-center", className: "success"});
    });
    $("#ladder").click(function(){
        selectedProduct = "ladder";
        $.notify("上好的云梯哟!",{position:"top-center", className: "success"});
    });
    $("#fallingStone").click(function(){
        selectedProduct = "fallingStone";
        $.notify("上好的落石哟!",{position:"top-center", className: "success"});
    });
    $("#catapult").click(function(){
        selectedProduct = "catapult";
        $.notify("上好的投石车哟!",{position:"top-center", className: "success"});
    });
    $("#weaponUp").click(function(){
        selectedProduct = "weaponUp";
        $.notify("稀缺的武器碎片哟!",{position:"top-center", className: "success"});
    });
    $("#equipUp").click(function(){
        selectedProduct = "equipUp";
        $.notify("稀缺的装备碎片哟!",{position:"top-center", className: "success"});
    });
    $("#horseHelmetUp").click(function(){
        selectedProduct = "horseHelmetUp";
        $.notify("稀缺的马盔碎片哟!",{position:"top-center", className: "success"});
    });
    $("#horseSaddleUp").click(function(){
        selectedProduct = "horseSaddleUp";
        $.notify("稀缺的马鞍碎片哟!",{position:"top-center", className: "success"});
    });
    $("#horseUp").click(function(){
        selectedProduct = "horseUp";
        $.notify("稀缺的战马碎片哟!",{position:"top-center", className: "success"});
    });
});

//根据商品类型,价格,数量,和类型,挂buyOffer or sellOffer
function postOffer(product, price, amount, type, country){   //type=sell/buy
    var offer = AV.Object.extend('market');
    offer.set("product", product).set("type",type).set("price", price).set("amount", amount).set("country", country);
    offer.save().then(function(){
        $.notify("您的报单已提交!",{position:"top-center", className: "success"});
    });
}

//根据订单编号取消订单
function withdrawOffer(objectId){
    var offer = AV.Object.createWithoutData('market', objectId);
    offer.destroy();
}

//根据商品类型,价格,数量,和类型,直接购买或卖出
function trade(product, price, type, offerId, amount){   // product, price, type, offerId, amount
    var offer = AV.Object.extend('market');
    market.set("product", product);
    market.set("");
}

//TODO 根据商品类型和交易类型,展示buyOffer or sellOffer
function showOffer(){  //type=sell/buy product=rice/iron/wood/stone/food/weapon/ladder/rollingWood/fallingStone/catapult
    $("#tableBody").empty();
    console.log("empty");
    var country = $("#countrySelected :selected").val();
    var type = $("#typeSelected :selected").val();
    console.log("country is; " + country + "type is: " + type);
    var query = new AV.Query('market');
    // equalTo("country", country)
    query.equalTo("type", type).equalTo("product",selectedProduct);
    if (type === "buy"){
        query.ascending("price");
    }else{
        query.ascending("price");
    }
    query.limit(20);
    query.find().then(function(offers) {
        offers.forEach(function (offer, i, a) {
            console.log(offer);
            //获取商品信息,ownerName,价格, 数量
            var ownerName = offer.get('ownerName');
            var product = offer.get("product");
            var amount = offer.get("amount");
            var price = offer.get("price");
            var offerId = offer.get("objectId");
            var tableBody = document.getElementById("tableBody");
            var row = tableBody.insertRow(-1);
            var cell1 = row.insertCell(-1);
            cell1.innerHTML = ownerName;
            var cell2 = row.insertCell(-1);
            cell2.innerHTML = amount;
            var cell3 = row.insertCell(-1);
            cell3.innerHTML = price;
            var cell4 = row.insertCell(-1);
            cell4.innerHTML = "<input type='number'>";
            var cell5 = row.insertCell(-1);
            // product, price, type, offerId, amount
            var tradeParams = [];
            tradeParams.push(product);
            tradeParams.push(price);
            tradeParams.push(type);
            tradeParams.push(offerId);
            cell5.innerHTML = "<button type='button' onclick='preTrade(" + tradeParams + ")'>点击购买</button>";
        });
    });
}

function preTrade(tradeParams){
    var amount = 0;
    $(this).closest('tr').find("input").each(function() {
        amount = this.value;
    });
    tradeParams.push(amount);
    trade(tradeParams);
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

