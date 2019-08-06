//根据商品类型和交易类型,展示buyOffer or sellOffer
function showOffer(product, type){  //type=sell/buy product=rice/iron/wood/stone/food/weapon/ladder/rollingWood/fallingStone/catapult
    var query = new AV.Query('market');
    query.equalTo("product", product).equalTo("type", type);
    query.find().then(function(){


    });
}

//根据商品类型,价格,数量,和类型,挂buyOffer or sellOffer
function postOffer(product, price, amount, type){   //type=sell/buy
    var offer = AV.Object.extend('market');
    market.set("product", product);
    market.set("");
}

//根据商品类型,价格,数量,和类型,直接购买或卖出
function trade(product, price, amount, type){   //type=sell/buy
    var offer = AV.Object.extend('market');
    market.set("product", product);
    market.set("");
}

