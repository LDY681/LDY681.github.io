$(function(){
    $("#resetMap").on("click", function(){
        resetAll();
    });
});

function resetAll(){
    //重置城池所属国家,战争状态
    resetWei();
    resetShu();
    resetWu();

    //重置城池资源属性rice, wheat, iron, wood
    resetResource();
}

function resetWei(){
    var weiguo = AV.Object.createWithoutData('country', '5d2d9dc14415dc00089bd0fe');    // 假设 GuangDong 的 objectId 为 56545c5b00b09f857a603632
    var query = new AV.Query('city');
    query.lessThanOrEqualTo('cityId',26);
    query.find().then(function (cities) {
        cities.forEach(function(city) {
            city.set('owner', weiguo);
            city.set('isAtWar', false);
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
            city.set('isAtWar', false);
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
            city.set('isAtWar', false);
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


function resetAdjacent(){
    var query = new AV.Query('city');
    query.ascending("cityId");
    query.find().then(function (cities) {

        var xiangping = cities[0];
        var beiping = cities[1];
        var ji = cities[2];
        var nanpi = cities[3];
        var zhongshan = cities[4];
        var julu = cities[5];
        var ganling = cities[6];
        var ye = cities[7];
        var jinyang = cities[8];
        var shangdang = cities[9];
        var pingyuan = cities[10];
        var beihai = cities[11];
        var langya = cities[12];
        var xiapi = cities[13];
        var guangling = cities[14];
        var jibei = cities[15];
        var puyang = cities[16];
        var chenliu = cities[17];
        var xiaopei = cities[18];
        var qiao = cities[19];
        var xuchang = cities[20];
        var runan = cities[21];
        var wan = cities[22];
        var henei = cities[23];
        var luoyang = cities[24];
        var hongnong = cities[25];
        var changan = cities[26];
        var anding = cities[27];
        var tianshui = cities[28];
        var wuwei = cities[29];
        var jincheng = cities[30];
        var wudu = cities[31];
        var hanzhong = cities[32];
        var yongan = cities[33];
        var zitong = cities[34];
        var chengdu = cities[35];
        var jiangzhou = cities[36];
        var zangke = cities[37];
        var yuexi = cities[38];
        var jianning = cities[39];
        var yongchang = cities[40];
        var shangyong = cities[41];
        var xinye = cities[42];
        var xiangyang = cities[43];
        var jiangxia = cities[44];
        var jiangling = cities[45];
        var changsha = cities[46];
        var wuling = cities[47];
        var guiyang = cities[48];
        var lingling = cities[49];
        var shouchun = cities[50];
        var lujiang = cities[51];
        var jianye = cities[52];
        var wu = cities[53];
        var kuaiji = cities[54];
        var yuzhang = cities[55];
        var jianan = cities[56];
        var nanhai = cities[57];
        var hepu = cities[58];
        var jiaozhi = cities[59];

        var map = new Array(60);
        // 0 襄平 - 北平
        map[0] = new AV.Object('map');
        map[0].set('src', xiangping);
        map[0].set('srcCity' , "襄平");
        map[0].set('dest', beiping);
        map[0].set('destCity' , "北平");





        // 1 北平 - 襄平
        map[1] = new AV.Object('map');
        map[1].set('src', beiping);
        map[1].set('srcCity' , "北平");
        map[1].set('dest', xiangping);
        map[1].set('destCity' , "襄平");
        // 2 北平 - 蓟
        map[2] = new AV.Object('map');
        map[2].set('src', beiping);
        map[2].set('srcCity' , "北平");
        map[2].set('dest', ji);
        map[2].set('destCity' , "蓟");
        // 3 北平 - 南皮
        map[3] = new AV.Object('map');
        map[3].set('src', beiping);
        map[3].set('srcCity' , "北平");
        map[3].set('dest', nanpi);
        map[3].set('destCity' , "南皮");





        // 4 蓟 - 中山
        map[4] = new AV.Object('map');
        map[4].set('src', ji);
        map[4].set('srcCity' , "蓟");
        map[4].set('dest', zhongshan);
        map[4].set('destCity' , "中山");
        // 5 蓟 - 南皮
        map[5] = new AV.Object('map');
        map[5].set('src', ji);
        map[5].set('srcCity' , "蓟");
        map[5].set('dest', nanpi);
        map[5].set('destCity' , "南皮");
        // 6 蓟 - 北平
        map[6] = new AV.Object('map');
        map[6].set('src', ji);
        map[6].set('srcCity' , "蓟");
        map[6].set('dest', beiping);
        map[6].set('destCity' , "北平");





        // 7 南皮 - 甘陵
        map[7] = new AV.Object('map');
        map[7].set('src', nanpi);
        map[7].set('srcCity' , "南皮");
        map[7].set('dest', ganling);
        map[7].set('destCity' , "甘陵");
        // 8 南皮 - 平原
        map[8] = new AV.Object('map');
        map[8].set('src', nanpi);
        map[8].set('srcCity' , "南皮");
        map[8].set('dest', pingyuan);
        map[8].set('destCity' , "平原");
        // 9 南皮 - 蓟
        map[9] = new AV.Object('map');
        map[9].set('src', nanpi);
        map[9].set('srcCity' , "南皮");
        map[9].set('dest', ji);
        map[9].set('destCity' , "蓟");
        // 10 南皮 - 北平
        map[10] = new AV.Object('map');
        map[10].set('src', nanpi);
        map[10].set('srcCity' , "南皮");
        map[10].set('dest', beiping);
        map[10].set('destCity' , "北平");





        //11 中山-钜鹿
        map[11] = new AV.Object('map');
        map[11].set('src', zhongshan);
        map[11].set('srcCity' , "中山");
        map[11].set('dest', julu);
        map[11].set('destCity' , "巨鹿");
        //12 中山-蓟
        map[12] = new AV.Object('map');
        map[12].set('src', zhongshan);
        map[12].set('srcCity' , "中山");
        map[12].set('dest', ji);
        map[12].set('destCity' , "蓟");





        //13 钜鹿-晋阳
        map[13] = new AV.Object('map');
        map[13].set('src', julu);
        map[13].set('srcCity' , "巨鹿");
        map[13].set('dest', jinyang);
        map[13].set('destCity' , "晋阳");
        //14 钜鹿-甘陵
        map[14] = new AV.Object('map');
        map[14].set('src', julu);
        map[14].set('srcCity' , "巨鹿");
        map[14].set('dest', ganling);
        map[14].set('destCity' , "甘陵");
        //15 钜鹿-中山
        map[15] = new AV.Object('map');
        map[15].set('src', julu);
        map[15].set('srcCity' , "巨鹿");
        map[15].set('dest', zhongshan);
        map[15].set('destCity' , "中山");
        //16 钜鹿-南皮
        map[16] = new AV.Object('map');
        map[16].set('src', julu);
        map[16].set('srcCity' , "巨鹿");
        map[16].set('dest', nanpi);
        map[16].set('destCity' , "南皮");





        //17 甘陵-邺
        map[17] = new AV.Object('map');
        map[17].set('src', ganling);
        map[17].set('srcCity' , "甘陵");
        map[17].set('dest', ye);
        map[17].set('destCity' , "邺");
        //18 甘陵-平原
        map[18] = new AV.Object('map');
        map[18].set('src', ganling);
        map[18].set('srcCity' , "甘陵");
        map[18].set('dest', pingyuan);
        map[18].set('destCity' , "平原");
        //19 甘陵-钜鹿
        map[19] = new AV.Object('map');
        map[19].set('src', ganling);
        map[19].set('srcCity' , "甘陵");
        map[19].set('dest', julu);
        map[19].set('destCity' , "巨鹿");
        //20 甘陵-济北
        map[20] = new AV.Object('map');
        map[20].set('src', ganling);
        map[20].set('srcCity' , "甘陵");
        map[20].set('dest', jibei);
        map[20].set('destCity' , "济北");
        //21 甘陵-南皮
        map[21] = new AV.Object('map');
        map[21].set('src', ganling);
        map[21].set('srcCity' , "甘陵");
        map[21].set('dest', nanpi);
        map[21].set('destCity' , "南皮");





        //22 邺-上党
        map[22] = new AV.Object('map');
        map[22].set('src', ye);
        map[22].set('srcCity' , "邺");
        map[22].set('dest', shangdang);
        map[22].set('destCity' , "上党");
        //23 邺-甘陵
        map[23] = new AV.Object('map');
        map[23].set('src', ye);
        map[23].set('srcCity' , "邺");
        map[23].set('dest', ganling);
        map[23].set('destCity' , "甘陵");
        //24 邺-濮阳
        map[24] = new AV.Object('map');
        map[24].set('src', ye);
        map[24].set('srcCity' , "邺");
        map[24].set('dest', puyang);
        map[24].set('destCity' , "濮阳");





        //25 晋阳-上党
        map[25] = new AV.Object('map');
        map[25].set('src', jinyang);
        map[25].set('srcCity' , "晋阳");
        map[25].set('dest', shangdang);
        map[25].set('destCity' , "上党");
        // 26 晋阳-巨鹿
        map[26] = new AV.Object('map');
        map[26].set('src', jinyang);
        map[26].set('srcCity' , "晋阳");
        map[26].set('dest', julu);
        map[26].set('destCity' , "巨鹿");





        //27上党-邺
        map[27] = new AV.Object('map');
        map[27].set('src', shangdang);
        map[27].set('srcCity' , "上党");
        map[27].set('dest', ye);
        map[27].set('destCity' , "邺");
        //28 上党-河内
        map[28] = new AV.Object('map');
        map[28].set('src', shangdang);
        map[28].set('srcCity' , "上党");
        map[28].set('dest', henei);
        map[28].set('destCity' , "河内");
        // 29 上党-弘农
        map[29] = new AV.Object('map');
        map[29].set('src', shangdang);
        map[29].set('srcCity' , "上党");
        map[29].set('dest', hongnong);
        map[29].set('destCity' , "弘农");
        // 30 上党-晋阳
        map[30] = new AV.Object('map');
        map[30].set('src', shangdang);
        map[30].set('srcCity' , "上党");
        map[30].set('dest', jinyang);
        map[30].set('destCity' , "晋阳");





        //31平原-甘陵
        map[31] = new AV.Object('map');
        map[31].set('src', pingyuan);
        map[31].set('srcCity' , "平原");
        map[31].set('dest', ganling);
        map[31].set('destCity' , "甘陵");
        // 32南皮
        map[32] = new AV.Object('map');
        map[32].set('src', pingyuan);
        map[32].set('srcCity' , "平原");
        map[32].set('dest', nanpi);
        map[32].set('destCity' , "南皮");
        // 33北海
        map[33] = new AV.Object('map');
        map[33].set('src', pingyuan);
        map[33].set('srcCity' , "平原");
        map[33].set('dest', beihai);
        map[33].set('destCity' , "北海");
        // 34济北
        map[34] = new AV.Object('map');
        map[34].set('src', pingyuan);
        map[34].set('srcCity' , "平原");
        map[34].set('dest', jibei);
        map[34].set('destCity' , "济北");





        //35北海-平原
        map[35] = new AV.Object('map');
        map[35].set('src', beihai);
        map[35].set('srcCity' , "北海");
        map[35].set('dest', pingyuan);
        map[35].set('destCity' , "平原");
        // 36济北
        map[36] = new AV.Object('map');
        map[36].set('src', beihai);
        map[36].set('srcCity' , "北海");
        map[36].set('dest', jibei);
        map[36].set('destCity' , "济北");
        // 37琅琊
        map[37] = new AV.Object('map');
        map[37].set('src', beihai);
        map[37].set('srcCity' , "北海");
        map[37].set('dest', langya);
        map[37].set('destCity' , "琅琊");






            //TODO
        13//琅琊-北海,济北,广陵,下邳

        14//下邳-小沛,寿春,琅琊

        15//广陵-寿春,建业,琅琊,吴

        21//济北-甘陵,平原,濮阳,北海,小沛,琅琊,

        17//濮阳-济北,邺,陈留

        18//陈留-河内,濮阳,小沛,谯,许昌,洛阳

        19//小沛-陈留,谯,下邳,济北

        20//谯-陈留,小沛,寿春,汝南

        21//许昌-陈留,洛阳,宛,汝南

        22//汝南-许昌,谯,寿春,新野

        23//宛-弘农,许昌,新野

        24//河内-陈留,上党.洛阳

        25//洛阳-许昌,弘农,河内,陈留

        26//弘农-上党,洛阳,宛,长安

        27//长安-安定,弘农,天水,武都

        28//安定-虎威,长安,金城

        29//天水-金城,武都,长安

        30//武威-金城,安定

        31//金城-天水,安定

        32//武都-天水,长安,汉中,梓潼

        33//汉中-武都,梓潼,上庸

        34//永安-江州,江陵

        35//梓潼-武都,汉中,成都,江州

        36//成都-梓潼,江州,越巂

        37//江州-梓潼,成都,永安,牂牁,越巂

        38//牂牁-江州,建宁,合浦

        39//越巂-成都,江州,永昌

        40//建宁-永昌,牂牁,交趾

        41//永昌-建宁,越巂

        42//上庸-汉中,新野,襄阳

        43//新野-上庸,宛,汝南,襄阳,江夏

        44//襄阳-新野,江陵,上庸

        45//江夏-新野,豫章,庐江

        46//江陵-襄阳,永安,武陵,长沙

        47//长沙-江陵,武陵,桂阳

        48//武陵-江陵,长沙,零陵

        49//桂阳-长沙,零陵,南海

        50//零陵-武陵,桂阳,合浦

        51//寿春-谯,下邳,广陵,庐江,建业,汝南

        52//庐江=江夏,建业,寿春

        53//建业-广陵,寿春,庐江,吴,豫章

        54//吴-建业,广陵,会稽

        55//会稽-吴,豫章,建安

        56//豫章-江夏,建业,会稽,建安

        57//建安-豫章,南海,会稽

        58//南海-桂阳,建安,合浦,

        59//合浦-交趾,牂牁,零陵,南海

        60//交趾-建宁,合浦


        return AV.Object.saveAll(cities);
    });
}

function resetResource(){
    var query = new AV.Query('city');
    query.include(['owner']);
    query.find().then(function (cities) {
        cities.forEach(function(city) {

            if (city.get('owner').get("name") === "weiguo"){    //如果是魏国城市(魏国城市wheat加成)
                let rice = random();
                let wheat = randomBonus();
                let iron = random();
                let wood = random();
                city.set("rice", rice);
                city.set("wheat", wheat);
                city.set("iron", iron);
                city.set("wood", wood);
            }else if (city.get('owner').get("name") === "shuguo"){  //如果是蜀国城市(蜀国城市iron加成)
                let rice = random();
                let wheat = random();
                let iron = randomBonus();
                let wood = random();
                city.set("rice", rice);
                city.set("wheat", wheat);
                city.set("iron", iron);
                city.set("wood", wood);
            }else if (city.get('owner').get("name") === "wuguo"){   //如果是吴国城市(吴国城市rice加成)
                let rice = randomBonus();
                let wheat = random();
                let iron = random();
                let wood = random();
                city.set("rice", rice);
                city.set("wheat", wheat);
                city.set("iron", iron);
                city.set("wood", wood);
            }else{  //如果是黄巾城市(黄巾城市wood加成)
                let rice = random();
                let wheat = random();
                let iron = random();
                let wood = randomBonus();
                city.set("rice", rice);
                city.set("wheat", wheat);
                city.set("iron", iron);
                city.set("wood", wood);
            }

        });
        return AV.Object.saveAll(cities);
    }).then(function(todos) {
        // 更新成功
        console.log("随机资源设置成功");
    }, function (error) {
        // 异常处理
        console.log(JSON.stringify(error));
        console.log("随机资源设置失败");
    });
}

function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}

function random(){
    var random = (Math.random())*3;
    return round(random, 1);
}

function randomBonus(){
    var random = (Math.random())*5;
    return round(random, 1);
}
