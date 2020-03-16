var selectedProduct = "";
//查询 选择商品
$(function(){
    var item = $(".item");

    item.click(function(event){
        selectedProduct = event.target.id !== ""?event.target.id : event.target.parentNode.id;
        console.log("selectedProduct is :" + selectedProduct + "\n");
        $(".item").removeClass('itemMouseClick');
        $(this).addClass('itemMouseClick');
    });

    // 拉取更多报单
    // var productTable = document.getElementById('productContainer');
    // bindEvent(productTable, 'scroll', function(e) {
    //
    //     if( productTable.scrollHeight - productTable.scrollTop - productTable.clientHeight < 0)
    //     {
    //         showOffer(false);
    //     }
    // });
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
    if (type ==="" || isNaN(amount)|| product ===""|| isNaN(price)|| country ===""){
        $.notify("请选择类型,数量,产品,价格, 国家!", {position: "top-center", className: "error"});
        return;
    }
    if (price <= 0){
        $.notify("价格不能低于0!", {position: "top-center", className: "error"});
        return;
    }
    checkAvailability(type, price,amount,country,product).then(function(avail){
        console.log("钱/货是否足够:" + avail + "\n");
        if (avail === false) return;

        //钱货足够且订单信息齐全,开始上报
        console.log(type + " " + amount + " " + product + " at $" +  price + " in " + country);
        offer.set("product", product).set("type", type).set("price", price).set("amount", amount).set("country", country).set("ownerName", AV.User.current().get("username")).set("owner", AV.User.current());
        offer.save().then(function (res) {
            if (type === "buy") {    //如果挂的买单,查询钱够不够
                return takeMoney(price, amount, country);
            } else {
                return takeProduct(product, amount);
            }
        }).then(function () {
            $.notify("您的报单已提交!", {position: "top-center", className: "success"});
            setTimeout(function () {
                window.location.reload();
            }, 500)
        }).catch(function () {
            $.notify("报单提交失败！!", {position: "top-center", className: "error"});
        });
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
    var query = new AV.Query('market');
    query.get(offerId).then(function (offer) {
        let type = offer.get("type");
        let product = offer.get("product");
        let price = parseInt(offer.get("price"));
        let amount = parseInt(offer.get("amount"));
        let country = offer.get("country");
        let currency = getMoneyType(country);
        console.log("正在取消报单: "+ offerId + type + product + price + amount + country + currency);
        if (type === "buy"){    //买单,returnMoney
            console.log("买单:返还" + amount * price + " " + currency);
            returnMoney(currency, amount * price);
        }else{  //卖单,returnProduct
            console.log("卖单:返还" + amount + " " + product);
            returnProduct(product, amount);
        }
        offer.destroy().then(function(){
            alert("成功取消报单: "+ offerId);
            window.location.reload();
        });
    });
}

function returnMoney(currency, money){
    var user = AV.User.current();
    user.increment(currency, money);
    return user.save();
}
function returnProduct(product, amount){
    var user = AV.User.current();
    user.increment(product, amount);
    return user.save();
}

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

function showBattleList(status){
    var query = new AV.Query('city');
    query.include('owner');
    query.include('invader');
    query.include('warPending');
    switch (status){
        case "pending":
            query.equalTo("isWarPending", true);
            break;
        case "current":
            query.equalTo("isAtWar", true);
            break;
        case "past":
            break;
    }

    query.find().then(function(cities) {
        console.log(cities);
        cities.forEach(function (city, i, a) {
            //获取商品信息,ownerName,价格, 数量
            var name = city.get('name');
            console.log(name);
            var owner = city.get("owner").get("cname");
            console.log(owner);
            var invader = status === "current"? city.get("invader").get("cname"): city.get("warPending").get("cname");
            console.log(invader);
            var offdmg = city.get('offdmg');
            var defdmg = city.get('defdmg');
            var cityId = city.get('cityId');
            var currDate = new Date();
            var currDay = currDate.getDate();
            var currHour = currDate.getHours();
            if (currHour < 12){
                currHour = 12;
            }else{
                currHour = 24;
            }
            var time = currDay + "日" + currHour + "时";
            console.log(time);
            var tableBody = document.getElementById("tableBody");
            var row = tableBody.insertRow(-1);
            var cell0 = row.insertCell(-1);
            cell0.innerHTML = name;
            var cell1 = row.insertCell(-1);
            cell1.innerHTML = time;
            var cell2 = row.insertCell(-1);
            cell2.innerHTML = invader;
            if (status === "current"){
                var cell3 = row.insertCell(-1);
                cell3.innerHTML = offdmg;
            }
            var cell4 = row.insertCell(-1);
            cell4.innerHTML = owner;
            if (status === "current"){
                var cell3 = row.insertCell(-1);
                cell3.innerHTML = defdmg;
            }
            var cell6 = row.insertCell(-1);
            cell6.innerHTML = "<button type='button' class='w3-green w3-button w3-round-xlarge'><a href='city.html?id="+cityId+"'>进入</a></button>";
        });
    });
}
function bindEvent(dom, eventName, fun) {
    if (window.addEventListener) {
        dom.addEventListener(eventName, fun);
    } else {
        dom.attachEvent('on' + eventName, fun);
    }
}

//TODO 根据商品类型和交易类型,展示buyOffer or sellOffer
function showOffer(empty =true){  //type=sell/buy product=rice/iron/wood/stone/food/weapon/ladder/rollingWood/fallingStone/catapult
    if (empty === true){
        $("#tableBody").empty();
    }

    var country = $("#countrySelected :selected").val();
    var type = $("#typeSelected :selected").val();
    if (country === "" || type === "" || selectedProduct === ""){
        $.notify("请填写商品,国家和买卖类型!",{position:"top-center", className: "error"});
    }else{
        var query = new AV.Query('market');
        // equalTo("country", country)
        query.equalTo("type", type).equalTo("product",selectedProduct).equalTo("country", country);
        if (type === "buy"){
            query.ascending("price");
        }else{
            query.descending("price");
        }
        //query.limit(20);
        //query.skip(document.getElementById("tableBody").rows.length);
        //console.log(document.getElementById("tableBody").rows.length);
        query.find().then(function(offers) {
            if (offers.length === 0){
                if (empty === true){
                    $.notify("市场空空如也/(ㄒoㄒ)/~~",{position:"top-center", className: "error"});
                }
            }else {
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
                    var buttonText = (type === "buy") ? "出售" : "购买";
                    cell5.innerHTML = "<button class='w3-green w3-round-xlarge w3-button' type='button' onclick='trade.call(this)'>" + buttonText + "</button>";
                });
            }
        });
    }
}

//trade 收集提交信息,并且调用后端的trade函数
function trade(){
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

   console.log("交易信息为:");
   console.log(paramsJson);
   AV.Cloud.run('trade', paramsJson).then(function () {
       alert("交易成功!");
       window.location.reload();
   }).catch(function(err){
       let errorMsg = err.toString().split("[");
       alert(errorMsg[0]);
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


