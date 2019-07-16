$(function(){
    $("#resetMap").on("click", function(){
        resetAll();
    });

});

function resetAll(){
    resetWei();
    resetShu();
    resetWu();
}

function resetWei(){
    var weiguo = AV.Object.createWithoutData('country', '5d2d9dc14415dc00089bd0fe');    // 假设 GuangDong 的 objectId 为 56545c5b00b09f857a603632
    var query = new AV.Query('city');
    query.lessThanOrEqualTo('cityId',26);
    query.find().then(function (cities) {
        cities.forEach(function(city) {
            city.set('owner', weiguo);
        });
        return AV.Object.saveAll(cities);
    }).then(function(todos) {
        // 更新成功
        console.log("1-26城池设置为魏国");
    }, function (error) {
        // 异常处理
        console.log(JSON.stringify(error));
        console.log("魏国设置失败");
    });
}

function resetShu(){
    var shuguo = AV.Object.createWithoutData('country', '5d2d9dbd5dfe8c00082f979f');    // 假设 GuangDong 的 objectId 为 56545c5b00b09f857a603632
    var query = new AV.Query('city');
    query.greaterThan('cityId',26).lessThanOrEqualTo('cityId',42);
    query.find().then(function (cities) {
        cities.forEach(function(city) {
            city.set('owner', shuguo);
        });
        return AV.Object.saveAll(cities);
    }).then(function(todos) {
        // 更新成功
        console.log("27-42城池设置为蜀国");
    }, function (error) {
        // 异常处理
        console.log(JSON.stringify(error));
        console.log("蜀国设置失败");
    });
}

function resetWu(){
    var wuguo = AV.Object.createWithoutData('country', '5d2d9dc54415dc00089bd114');    // 假设 GuangDong 的 objectId 为 56545c5b00b09f857a603632
    var query = new AV.Query('city');
    query.greaterThanOrEqualTo('cityId',43);
    query.find().then(function (cities) {
        cities.forEach(function(city) {
            city.set('owner', wuguo);
        });
        return AV.Object.saveAll(cities);
    }).then(function(todos) {
        // 更新成功
        console.log("43-60城池设置为吴国");
    }, function (error) {
        // 异常处理
        console.log(JSON.stringify(error));
        console.log("吴国设置失败");
    });
}
