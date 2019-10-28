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
function postOffer(){
    var country = $("#countrySelected :selected").val();
    var type = $("#typeSelected :selected").val();
    var amount = parseInt($("#amount").val());
    var price = parseInt($("#price").val());
    var product = selectedProduct;
    var market = AV.Object.extend('market');
    var offer = new market();
    console.log(type + " " + amount + " " + product + " at " +  price + " in " + country);
    checkAvailability(type, price,amount,country,product).then(function(avail){
        console.log("avail is " + avail);
        if (avail === true){
            offer.set("product", product).set("type",type).set("price", price).set("amount", amount).set("country", country).set("ownerName",AV.User.current().get("username")).set("owner",AV.User.current());
            offer.save().then(function(res){
                if (type === "buy"){    //如果挂的买单,查询钱够不够
                    return takeMoney(price, amount, country);
                }else{
                    return takeProduct(product, amount);
                }
            }).then(function(){
                $.notify("您的报单已提交!",{position:"top-center", className: "success"});
                setTimeout(function(){
                    window.location.reload();
                },500)
            }).catch(function(){
                $.notify("报单提交失败！!",{position:"top-center", className: "error"});
            });
        }else{
            $.notify("请确保商品,国家,买卖类型,数量,价格均填入！!",{position:"top-center", className: "error"});
        }
    });
}

//如果购买，检测钱够不够;如果出售，检测货够不够
function checkAvailability(type, price,amount,country,product){
    var availability = true;
    var user = AV.User.current();
    return user.fetch().then(function(){
        if (type === "buy"){    //如果挂的买单,查询钱够不够
            var payment = price * amount;
            var moneyType = getMoneyType(country);
            var money = user.get(moneyType);
            if (payment > money){
                $.notify("钱不够!",{position:"top-center", className: "error"});
                availability = false;
            }
        }else{
            var storage = user.get(product);
            if (amount > storage){
                $.notify("货不够!",{position:"top-center", className: "error"});
                availability = false;
            }
        }
        if (product === "" || type === "" || isNaN(amount) || isNaN(price) || country === ""){
            availability = false;
        }
        return new Promise(function(resolve){
            resolve(availability);
        });
    }).catch(function(){
        return new Promise(function(reject){
            reject(false);
        });
    });
}

function takeMoney(price, amount, country){
    var user = AV.User.current();
    var payment = price * amount;
    var moneyType = getMoneyType(country);
    console.log(moneyType + " " + -payment);
    user.increment(moneyType, -payment);
    return user.save();
}
function takeProduct(product, amount){
    var user = AV.User.current();
    console.log(product + " " + -amount);
    user.increment(product, -amount);
    return user.save();
}

//根据订单编号取消订单
function withdrawOffer(offerId){
    var offer = AV.Object.createWithoutData('market', offerId);
    offer.destroy().then(function(){
        alert("成功取消报单: "+ offerId);
        window.location.reload();
    });
}

function giveMoney(){}
function giveProduct(){}

//显示我的报单
function showMyOffer(){
    var query = new AV.Query('market');
    // equalTo("country", country)
    query.equalTo("owner", AV.User.current());
    query.find().then(function(offers) {
        console.log(offers);
        offers.forEach(function (offer, i, a) {
            //获取商品信息,ownerName,价格, 数量
            var type = offer.get('type');
            var product = offer.get("product");
            var amount = offer.get("amount");
            var price = offer.get("price");
            var offerId = offer.get("objectId");
            var country = offer.get("country");
            var tableBody = document.getElementById("tableBody");
            var row = tableBody.insertRow(-1);
            var cell0 = row.insertCell(-1);
            cell0.innerHTML = offerId;
            var cell1 = row.insertCell(-1);
            cell1.innerHTML = translator(type);
            var cell2 = row.insertCell(-1);
            cell2.innerHTML = translator(product);
            var cell3 = row.insertCell(-1);
            cell3.innerHTML = amount;
            var cell4 = row.insertCell(-1);
            cell4.innerHTML = price;
            var cell5 = row.insertCell(-1);
            cell5.innerHTML = translator(country);
            var cell6 = row.insertCell(-1);
            // product, price, type,offerId, amount
            cell6.innerHTML = "<button type='button' class='w3-green w3-button w3-round-xlarge' onclick='withdrawOffer(\""+offerId+"\")'>取消</button>";
        });
    });
}

//TODO 根据商品类型和交易类型,展示buyOffer or sellOffer
function showOffer(){  //type=sell/buy product=rice/iron/wood/stone/food/weapon/ladder/rollingWood/fallingStone/catapult
    $("#tableBody").empty();
    var country = $("#countrySelected :selected").val();
    var type = $("#typeSelected :selected").val();
    if (country === "" || type === "" || selectedProduct === ""){
        $.notify("请填写商品,国家和买卖类型!",{position:"top-center", className: "error"});
    }else{
        var query = new AV.Query('market');
        // equalTo("country", country)
        query.equalTo("type", type).equalTo("product",selectedProduct).equalTo("country", country);
        if (type === "buy"){
            query.ascending("price")    ;
        }else{
            query.descending("price");
        }
        query.limit(20);
        query.find().then(function(offers) {
            if (offers.length === 0){
                $.notify("市场空空如也/(ㄒoㄒ)/~~",{position:"top-center", className: "error"});
            }
            offers.forEach(function (offer, i, a) {
                //获取商品信息,ownerName,价格, 数量
                var ownerName = offer.get('ownerName');
                var product = offer.get("product");
                var amount = offer.get("amount");
                var price = offer.get("price");
                var offerId = offer.get("objectId");
                var tableBody = document.getElementById("tableBody");
                var row = tableBody.insertRow(-1);
                var cell0 = row.insertCell(-1);
                cell0.innerHTML = offerId;
                var cell1 = row.insertCell(-1);
                cell1.innerHTML = ownerName;
                var cell2 = row.insertCell(-1);
                cell2.innerHTML = amount;
                var cell3 = row.insertCell(-1);
                cell3.innerHTML = price;
                var cell4 = row.insertCell(-1);
                cell4.innerHTML = "<input type='number' id='myInput'>";
                var cell5 = row.insertCell(-1);
                var buttonText = (type==="buy")?"出售":"购买";
                cell5.innerHTML = "<button class='w3-green w3-round-xlarge w3-button' type='button' onclick='preTrade.call(this)'>" + buttonText + "</button>";
            });
        });
    }
}
function preTrade(){
    // product, price, type,offerId, amount
    var offerId = "";
    var price = 0;
    var product = selectedProduct;
    var action = ($("#typeSelected :selected").val() === "buy")?"sell":"buy";
    var amount;
    var i = 0;
    $(this).closest('tr').find('td').each(function(){
        switch (i){
            case 0:
                offerId = this.innerHTML;
                i++;
                break;
            case 1:
            case 2:
                i++;
                break;
            case 3:
                price = this.innerHTML;
                i++;
                break;
            default:
                i++;
                break;
        }
    });
    amount = $(this).closest('tr').find('td #myInput').val();

   var paramsJson = {
        product: product,
        price: price,
        action: action,
        offerId: offerId,
        amount: amount
    };

   console.log("paramsJson");
   console.log(paramsJson);
   AV.Cloud.run('trade', paramsJson).then(function () {
       alert("交易成功!");
       window.location.reload();
   }).catch(function(){
       alert("交易失败!");
       window.location.reload();
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

function getMoneyType(country){
    var money = "";
    switch (country){
        case "weiguo":
            money = "weiMoney";
            break;
        case "shuguo":
            money = "shuMoney";
            break;
        case "wuguo":
            money = "wuMoney";
            break;
        case "huangjin":
            money = "huangMoney";
            break;
        default:
            money = "gold";
    }
    return money;
}

function translator(english){
    switch(english){
        case "rice":
            return "谷物";
        case "iron":
            return "生铁";
        case "wood":
            return "原木";
        case "stone":
            return "粗石";
        case "food":
            return "军粮";
        case "weapon":
            return "兵器";
        case "ladder":
            return "云梯";
        case "rollingWood":
            return "滚木";
        case "fallingStone":
            return "落石";
        case "catapult":
            return "投石车";
        case "buy":
            return "买单";
        case "sell":
            return "卖单";
        case "weiguo":
            return "魏国";
        case "shuguo":
            return "蜀国";
        case "wuguo":
            return "吴国";
        case "huangjin":
            return "黄巾";
    }
}

