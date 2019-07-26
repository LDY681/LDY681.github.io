$(function(){
    $("#resetMap").on("click", function(){
        resetAll();
    });
    $("#resetResource").on("click", function(){
        resetResource();
    });
    $("#resetAdjacent").on("click", function(){
        resetAdjacent();
    });
    $("#resetRecentDamage").on("click", function(){
        resetRecentDamage();
    });
});

//重置城池所属国家,战争状态
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
            city.set('isAtWar', false);
        });
        return AV.Object.saveAll(cities);
    }).then(function(todos) {
        // 更新成功
        alert("1-26城池设置为魏国");
    }, function (error) {
        // 异常处理
        alert(JSON.stringify(error));
        alert("魏国设置失败");
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
        alert("27-42城池设置为蜀国");
    }, function (error) {
        // 异常处理
        alert(JSON.stringify(error));
        alert("蜀国设置失败");
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
        alert("43-60城池设置为吴国");
    }, function (error) {
        // 异常处理
        alert(JSON.stringify(error));
        alert("吴国设置失败");
    });
}

//已弃用,更新city的recentDamage数组
function resetRecentDamage(){
    var query = new AV.Query('city');
    query.find().then(function (cities) {
        var emptyDamage = [];
        cities.forEach(function(city) {
            city.set('invaderRecentDamage', emptyDamage);
            city.set('defenderRecentDamage', emptyDamage);
        });
        return AV.Object.saveAll(cities);
    }).then(function(todos) {
        // 更新成功
        alert("所有战场最新伤害重置成功");
    }, function (error) {
        // 异常处理
        alert(JSON.stringify(error));
        alert("战场最新伤害重置失败");
    });

}

//重置相邻城市network
function resetAdjacent(){
    var query = new AV.Query('city');
    query.ascending("cityId");
    query.find().then(function (cities) {
        var map = new Array(205);


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






        //38琅琊-北海
        map[38] = new AV.Object('map');
        map[38].set('src', langya);
        map[38].set('srcCity' , "琅琊");
        map[38].set('dest', beihai);
        map[38].set('destCity' , "北海");
        // 39济北
        map[39] = new AV.Object('map');
        map[39].set('src', langya);
        map[39].set('srcCity' , "琅琊");
        map[39].set('dest', jibei);
        map[39].set('destCity' , "济北");
        // 40广陵
        map[40] = new AV.Object('map');
        map[40].set('src', langya);
        map[40].set('srcCity' , "琅琊");
        map[40].set('dest', guangling);
        map[40].set('destCity' , "广陵");
        // 41下邳
        map[41] = new AV.Object('map');
        map[41].set('src', langya);
        map[41].set('srcCity' , "琅琊");
        map[41].set('dest', xiapi);
        map[41].set('destCity' , "下邳");




        //42下邳-小沛
        map[42] = new AV.Object('map');
        map[42].set('src', xiapi);
        map[42].set('srcCity' , "下邳");
        map[42].set('dest', xiaopei);
        map[42].set('destCity' , "小沛");
        // 43寿春
        map[43] = new AV.Object('map');
        map[43].set('src', xiapi);
        map[43].set('srcCity' , "下邳");
        map[43].set('dest', shouchun);
        map[43].set('destCity' , "寿春");
        // 44琅琊
        map[44] = new AV.Object('map');
        map[44].set('src', xiapi);
        map[44].set('srcCity' , "下邳");
        map[44].set('dest', langya);
        map[44].set('destCity' , "琅琊");




        //45广陵-寿春
        map[45] = new AV.Object('map');
        map[45].set('src', guangling);
        map[45].set('srcCity' , "广陵");
        map[45].set('dest', shouchun);
        map[45].set('destCity' , "寿春");
        // 46建业
        map[46] = new AV.Object('map');
        map[46].set('src', guangling);
        map[46].set('srcCity' , "广陵");
        map[46].set('dest', jianye);
        map[46].set('destCity' , "建业");
        // 47琅琊
        map[47] = new AV.Object('map');
        map[47].set('src', guangling);
        map[47].set('srcCity' , "广陵");
        map[47].set('dest', langya);
        map[47].set('destCity' , "琅琊");
        // 48吴
        map[48] = new AV.Object('map');
        map[48].set('src', guangling);
        map[48].set('srcCity' , "广陵");
        map[48].set('dest', wu);
        map[48].set('destCity' , "吴");





        //49济北-甘陵
        map[49] = new AV.Object('map');
        map[49].set('src', jibei);
        map[49].set('srcCity' , "济北");
        map[49].set('dest', ganling);
        map[49].set('destCity' , "甘陵");
        // 50平原
        map[50] = new AV.Object('map');
        map[50].set('src', jibei);
        map[50].set('srcCity' , "济北");
        map[50].set('dest', pingyuan);
        map[50].set('destCity' , "平原");
        // 51濮阳
        map[51] = new AV.Object('map');
        map[51].set('src', jibei);
        map[51].set('srcCity' , "济北");
        map[51].set('dest', puyang);
        map[51].set('destCity' , "濮阳");
        // 52北海
        map[52] = new AV.Object('map');
        map[52].set('src', jibei);
        map[52].set('srcCity' , "济北");
        map[52].set('dest', beihai);
        map[52].set('destCity' , "北海");
        // 53小沛
        map[53] = new AV.Object('map');
        map[53].set('src', jibei);
        map[53].set('srcCity' , "济北");
        map[53].set('dest', xiaopei);
        map[53].set('destCity' , "小沛");
        // 54琅琊
        map[54] = new AV.Object('map');
        map[54].set('src', jibei);
        map[54].set('srcCity' , "济北");
        map[54].set('dest', langya);
        map[54].set('destCity' , "琅琊");






        //55濮阳-济北
        map[55] = new AV.Object('map');
        map[55].set('src', puyang);
        map[55].set('srcCity' , "濮阳");
        map[55].set('dest', jibei);
        map[55].set('destCity' , "济北");
        // 56邺,
        map[56] = new AV.Object('map');
        map[56].set('src', puyang);
        map[56].set('srcCity' , "濮阳");
        map[56].set('dest', ye);
        map[56].set('destCity' , "邺");
        // 57陈留
        map[57] = new AV.Object('map');
        map[57].set('src', puyang);
        map[57].set('srcCity' , "濮阳");
        map[57].set('dest', chenliu);
        map[57].set('destCity' , "陈留");




        //58陈留-河内
        map[58] = new AV.Object('map');
        map[58].set('src', chenliu);
        map[58].set('srcCity' , "陈留");
        map[58].set('dest', henei);
        map[58].set('destCity' , "河内");
        // 59濮阳
        map[59] = new AV.Object('map');
        map[59].set('src', chenliu);
        map[59].set('srcCity' , "陈留");
        map[59].set('dest', puyang);
        map[59].set('destCity' , "濮阳");
        // 60小沛
        map[60] = new AV.Object('map');
        map[60].set('src', chenliu);
        map[60].set('srcCity' , "陈留");
        map[60].set('dest', xiaopei);
        map[60].set('destCity' , "小沛");
        // 61谯
        map[61] = new AV.Object('map');
        map[61].set('src', chenliu);
        map[61].set('srcCity' , "陈留");
        map[61].set('dest', qiao);
        map[61].set('destCity' , "谯");
        // 62许昌
        map[62] = new AV.Object('map');
        map[62].set('src', chenliu);
        map[62].set('srcCity' , "陈留");
        map[62].set('dest', xuchang);
        map[62].set('destCity' , "许昌");
        // 63洛阳
        map[63] = new AV.Object('map');
        map[63].set('src', chenliu);
        map[63].set('srcCity' , "陈留");
        map[63].set('dest', luoyang);
        map[63].set('destCity' , "洛阳");





        //64小沛-陈留
        map[64] = new AV.Object('map');
        map[64].set('src', xiaopei);
        map[64].set('srcCity' , "小沛");
        map[64].set('dest', chenliu);
        map[64].set('destCity' , "陈留");
        // 65谯
        map[65] = new AV.Object('map');
        map[65].set('src', xiaopei);
        map[65].set('srcCity' , "小沛");
        map[65].set('dest', qiao);
        map[65].set('destCity' , "谯");
        // 66下邳
        map[66] = new AV.Object('map');
        map[66].set('src', xiaopei);
        map[66].set('srcCity' , "小沛");
        map[66].set('dest', xiapi);
        map[66].set('destCity' , "下邳");
        //67济北
        map[67] = new AV.Object('map');
        map[67].set('src', xiaopei);
        map[67].set('srcCity' , "小沛");
        map[67].set('dest', jibei);
        map[67].set('destCity' , "济北");




        //68谯-陈留
        map[68] = new AV.Object('map');
        map[68].set('src', qiao);
        map[68].set('srcCity' , "谯");
        map[68].set('dest', chenliu);
        map[68].set('destCity' , "陈留");
        // 69小沛
        map[69] = new AV.Object('map');
        map[69].set('src', qiao);
        map[69].set('srcCity' , "谯");
        map[69].set('dest', xiaopei);
        map[69].set('destCity' , "小沛");
        // 70寿春
        map[70] = new AV.Object('map');
        map[70].set('src', qiao);
        map[70].set('srcCity' , "谯");
        map[70].set('dest', shouchun);
        map[70].set('destCity' , "寿春");
        // 71汝南
        map[71] = new AV.Object('map');
        map[71].set('src', qiao);
        map[71].set('srcCity' , "谯");
        map[71].set('dest', runan);
        map[71].set('destCity' , "汝南");




        //72许昌-陈留
        map[72] = new AV.Object('map');
        map[72].set('src', xuchang);
        map[72].set('srcCity' , "许昌");
        map[72].set('dest', chenliu);
        map[72].set('destCity' , "陈留");
        // 73洛阳
        map[73] = new AV.Object('map');
        map[73].set('src', xuchang);
        map[73].set('srcCity' , "许昌");
        map[73].set('dest', luoyang);
        map[73].set('destCity' , "洛阳");
        // 74宛
        map[74] = new AV.Object('map');
        map[74].set('src', xuchang);
        map[74].set('srcCity' , "许昌");
        map[74].set('dest', wan);
        map[74].set('destCity' , "宛");
        // 75汝南
        map[75] = new AV.Object('map');
        map[75].set('src', xuchang);
        map[75].set('srcCity' , "许昌");
        map[75].set('dest', runan);
        map[75].set('destCity' , "汝南");




        //76汝南-许昌
        map[76] = new AV.Object('map');
        map[76].set('src', runan);
        map[76].set('srcCity' , "汝南");
        map[76].set('dest', xuchang);
        map[76].set('destCity' , "许昌");
        // 77谯
        map[77] = new AV.Object('map');
        map[77].set('src', runan);
        map[77].set('srcCity' , "汝南");
        map[77].set('dest', qiao);
        map[77].set('destCity' , "谯");
        // 78寿春
        map[78] = new AV.Object('map');
        map[78].set('src', runan);
        map[78].set('srcCity' , "汝南");
        map[78].set('dest', shouchun);
        map[78].set('destCity' , "寿春");
        // 79新野
        map[79] = new AV.Object('map');
        map[79].set('src', runan);
        map[79].set('srcCity' , "汝南");
        map[79].set('dest', xinye);
        map[79].set('destCity' , "新野");





        //80宛-弘农
        map[80] = new AV.Object('map');
        map[80].set('src', wan);
        map[80].set('srcCity' , "宛");
        map[80].set('dest', hongnong);
        map[80].set('destCity' , "弘农");
        // 81许昌
        map[81] = new AV.Object('map');
        map[81].set('src', wan);
        map[81].set('srcCity' , "宛");
        map[81].set('dest', xuchang);
        map[81].set('destCity' , "许昌");
        // 82新野
        map[82] = new AV.Object('map');
        map[82].set('src', wan);
        map[82].set('srcCity' , "宛");
        map[82].set('dest', xinye);
        map[82].set('destCity' , "新野");



        //83河内-陈留
        map[83] = new AV.Object('map');
        map[83].set('src', henei);
        map[83].set('srcCity' , "河内");
        map[83].set('dest', chenliu);
        map[83].set('destCity' , "陈留");
        // 84上党
        map[84] = new AV.Object('map');
        map[84].set('src', henei);
        map[84].set('srcCity' , "河内");
        map[84].set('dest', shangdang);
        map[84].set('destCity' , "上党");
        // 85洛阳
        map[85] = new AV.Object('map');
        map[85].set('src', henei);
        map[85].set('srcCity' , "河内");
        map[85].set('dest', luoyang);
        map[85].set('destCity' , "洛阳");




        //86洛阳-许昌
        map[86] = new AV.Object('map');
        map[86].set('src', luoyang);
        map[86].set('srcCity' , "洛阳");
        map[86].set('dest', xuchang);
        map[86].set('destCity' , "许昌");
        // 87弘农
        map[87] = new AV.Object('map');
        map[87].set('src', luoyang);
        map[87].set('srcCity' , "洛阳");
        map[87].set('dest', hongnong);
        map[87].set('destCity' , "弘农");
        // 88河内
        map[88] = new AV.Object('map');
        map[88].set('src', luoyang);
        map[88].set('srcCity' , "洛阳");
        map[88].set('dest', henei);
        map[88].set('destCity' , "河内");
        // 89陈留
        map[89] = new AV.Object('map');
        map[89].set('src', luoyang);
        map[89].set('srcCity' , "洛阳");
        map[89].set('dest', chenliu);
        map[89].set('destCity' , "陈留");




        //90弘农-上党
        map[90] = new AV.Object('map');
        map[90].set('src', hongnong);
        map[90].set('srcCity' , "弘农");
        map[90].set('dest', shangdang);
        map[90].set('destCity' , "上党");
        // 91洛阳
        map[91] = new AV.Object('map');
        map[91].set('src', hongnong);
        map[91].set('srcCity' , "弘农");
        map[91].set('dest', luoyang);
        map[91].set('destCity' , "洛阳");
        // 92宛
        map[92] = new AV.Object('map');
        map[92].set('src', hongnong);
        map[92].set('srcCity' , "弘农");
        map[92].set('dest', wan);
        map[92].set('destCity' , "宛");
        // 93长安
        map[93] = new AV.Object('map');
        map[93].set('src', hongnong);
        map[93].set('srcCity' , "弘农");
        map[93].set('dest', changan);
        map[93].set('destCity' , "长安");




        //94长安-安定
        map[94] = new AV.Object('map');
        map[94].set('src', changan);
        map[94].set('srcCity' , "长安");
        map[94].set('dest', anding);
        map[94].set('destCity' , "安定");
        // 95弘农
        map[95] = new AV.Object('map');
        map[95].set('src', changan);
        map[95].set('srcCity' , "长安");
        map[95].set('dest', hongnong);
        map[95].set('destCity' , "弘农");
        // 96天水
        map[96] = new AV.Object('map');
        map[96].set('src', changan);
        map[96].set('srcCity' , "长安");
        map[96].set('dest', tianshui);
        map[96].set('destCity' , "天水");
        // 97武都
        map[97] = new AV.Object('map');
        map[97].set('src', changan);
        map[97].set('srcCity' , "长安");
        map[97].set('dest', wudu);
        map[97].set('destCity' , "武都");




        //98安定-虎威
        map[98] = new AV.Object('map');
        map[98].set('src', anding);
        map[98].set('srcCity' , "安定");
        map[98].set('dest', wuwei);
        map[98].set('destCity' , "武威");
        // 99长安
        map[99] = new AV.Object('map');
        map[99].set('src', anding);
        map[99].set('srcCity' , "安定");
        map[99].set('dest', changan);
        map[99].set('destCity' , "长安");
        // 100金城
        map[100] = new AV.Object('map');
        map[100].set('src', anding);
        map[100].set('srcCity' , "安定");
        map[100].set('dest', jincheng);
        map[100].set('destCity' , "金城");





        //101天水-金城
        map[101] = new AV.Object('map');
        map[101].set('src', tianshui);
        map[101].set('srcCity' , "天水");
        map[101].set('dest', jincheng);
        map[101].set('destCity' , "金城");
        // 102武都
        map[102] = new AV.Object('map');
        map[102].set('src', tianshui);
        map[102].set('srcCity' , "天水");
        map[102].set('dest', wudu);
        map[102].set('destCity' , "武都");
        // 103长安
        map[103] = new AV.Object('map');
        map[103].set('src', tianshui);
        map[103].set('srcCity' , "天水");
        map[103].set('dest', changan);
        map[103].set('destCity' , "长安");
        

        //104武威-金城
        map[104] = new AV.Object('map');
        map[104].set('src', wuwei);
        map[104].set('srcCity' , "武威");
        map[104].set('dest', jincheng);
        map[104].set('destCity' , "金城");
        // 105安定
        map[105] = new AV.Object('map');
        map[105].set('src', wuwei);
        map[105].set('srcCity' , "武威");
        map[105].set('dest', anding);
        map[105].set('destCity' , "安定");



        //106金城-天水
        map[106] = new AV.Object('map');
        map[106].set('src', jincheng);
        map[106].set('srcCity' , "金城");
        map[106].set('dest', tianshui);
        map[106].set('destCity' , "天水");
        // 107安定
        map[107] = new AV.Object('map');
        map[107].set('src', jincheng);
        map[107].set('srcCity' , "金城");
        map[107].set('dest', anding);
        map[107].set('destCity' , "安定");



        //108武都-天水
        map[108] = new AV.Object('map');
        map[108].set('src', wudu);
        map[108].set('srcCity' , "武都");
        map[108].set('dest', tianshui);
        map[108].set('destCity' , "天水");
        // 109长安
        map[109] = new AV.Object('map');
        map[109].set('src', wudu);
        map[109].set('srcCity' , "武都");
        map[109].set('dest', changan);
        map[109].set('destCity' , "长安");
        // 110汉中
        map[110] = new AV.Object('map');
        map[110].set('src', wudu);
        map[110].set('srcCity' , "武都");
        map[110].set('dest', hanzhong);
        map[110].set('destCity' , "汉中");
        // 111梓潼
        map[111] = new AV.Object('map');
        map[111].set('src', wudu);
        map[111].set('srcCity' , "武都");
        map[111].set('dest', zitong);
        map[111].set('destCity' , "梓潼");




        //112汉中-武都
        map[112] = new AV.Object('map');
        map[112].set('src', hanzhong);
        map[112].set('srcCity' , "汉中");
        map[112].set('dest', wudu);
        map[112].set('destCity' , "武都");
        // 113梓潼
        map[113] = new AV.Object('map');
        map[113].set('src', hanzhong);
        map[113].set('srcCity' , "汉中");
        map[113].set('dest', zitong);
        map[113].set('destCity' , "梓潼");
        // 114上庸
        map[114] = new AV.Object('map');
        map[114].set('src', hanzhong);
        map[114].set('srcCity' , "汉中");
        map[114].set('dest', shangyong);
        map[114].set('destCity' , "上庸");




        //115永安-江州
        map[115] = new AV.Object('map');
        map[115].set('src', yongan);
        map[115].set('srcCity' , "永安");
        map[115].set('dest', jiangzhou);
        map[115].set('destCity' , "江州");
        // 116江陵
        map[116] = new AV.Object('map');
        map[116].set('src', yongan);
        map[116].set('srcCity' , "永安");
        map[116].set('dest', jiangling);
        map[116].set('destCity' , "江陵");




        //117梓潼-武都
        map[117] = new AV.Object('map');
        map[117].set('src', zitong);
        map[117].set('srcCity' , "梓潼");
        map[117].set('dest', wudu);
        map[117].set('destCity' , "武都");
        // 118汉中
        map[118] = new AV.Object('map');
        map[118].set('src', zitong);
        map[118].set('srcCity' , "梓潼");
        map[118].set('dest', hanzhong);
        map[118].set('destCity' , "汉中");
        // 119成都
        map[119] = new AV.Object('map');
        map[119].set('src', zitong);
        map[119].set('srcCity' , "梓潼");
        map[119].set('dest', chengdu);
        map[119].set('destCity' , "成都");
        // 120江州
        map[120] = new AV.Object('map');
        map[120].set('src', zitong);
        map[120].set('srcCity' , "梓潼");
        map[120].set('dest', jiangzhou);
        map[120].set('destCity' , "江州");




        //121成都-梓潼
        map[121] = new AV.Object('map');
        map[121].set('src', chengdu);
        map[121].set('srcCity' , "成都");
        map[121].set('dest', zitong);
        map[121].set('destCity' , "梓潼");
        // 122江州
        map[122] = setMap(jiangzhou,"江州",chengdu,"成都");
        // 123越巂
        map[123] = setMap( yuexi,"越巂",chengdu,"成都");



        //124江州-梓潼
        map[124] = setMap( zitong,"梓潼",jiangzhou,"江州");
        // 125成都
        map[125] = setMap(chengdu,"成都",jiangzhou,"江州");
        // 126永安
        map[126] = setMap(yongan,"永安",jiangzhou,"江州");
        // 127牂牁
        map[127] = setMap( zangke,"牂牁",jiangzhou,"江州");
        // 128越巂
        map[128] = setMap( yuexi,"越巂",jiangzhou,"江州");




        //129牂牁-江州
        map[129] = setMap( jiangzhou,"江州",zangke,"牂牁");
        // 130建宁
        map[130] = setMap( jianning,"建宁",zangke,"牂牁");
        // 131合浦
        map[131] = setMap( hepu,"合浦",zangke,"牂牁");

        //132越巂-成都
        map[132] = setMap( chengdu,"成都",yuexi,"越巂");
        // 133江州
        map[133] = setMap( jiangzhou,"江州",yuexi,"越巂");
        // 134永昌
        map[134] = setMap( yongchang,"永昌",yuexi,"越巂");

        //135建宁-永昌
        map[135] = setMap( yongchang,"永昌",jianning,"建宁");
        // 136牂牁
        map[136] = setMap( zangke,"牂牁",jianning,"建宁");
        // 137交趾
        map[137] = setMap( jiaozhi,"交趾",jianning,"建宁");

        //138永昌-建宁
        map[138] = setMap( jianning,"建宁",yongchang,"永昌");
        // 139越巂
        map[139] = setMap( yuexi,"越巂",yongchang,"永昌");

        //140上庸-汉中
        map[140] = setMap( hanzhong,"汉中",shangyong,"上庸");
        // 141新野
        map[141] = setMap( xinye,"新野",shangyong,"上庸");
        // 142襄阳
        map[142] = setMap( xiangyang,"襄阳",shangyong,"上庸");

        //143新野-上庸
        map[143] = setMap( shangyong,"上庸",xinye,"新野");
        // 144宛
        map[144] = setMap( wan,"宛",xinye,"新野");
        // 145汝南
        map[145] = setMap( runan,"汝南",xinye,"新野");
        // 146襄阳
        map[146] = setMap( xiangyang,"襄阳",xinye,"新野");
        // 147江夏
        map[147] = setMap( jiangxia,"江夏",xinye,"新野");

        //148襄阳-新野
        map[148] = setMap( xinye,"新野",xiangyang,"襄阳");
        // 149江陵
        map[149] = setMap( jiangling,"江陵",xiangyang,"襄阳");
        // 150上庸
        map[150] = setMap( shangyong,"上庸",xiangyang,"襄阳");


        //151江夏-新野
        map[151] = setMap( xinye,"新野",jiangxia,"江夏");
        // 152豫章
        map[152] = setMap( yuzhang,"豫章",jiangxia,"江夏");
        // 153庐江
        map[153] = setMap( lujiang,"庐江",jiangxia,"江夏");

        //154江陵-襄阳
        map[154] = setMap( xiangyang,"襄阳",jiangling,"江陵");
        //155永安
        map[155] = setMap( yongan,"永安",jiangling,"江陵");
        // 156武陵
        map[156] = setMap( wuling,"武陵",jiangling,"江陵");
        // 157长沙
        map[157] = setMap( changsha,"长沙",jiangling,"江陵");

        //158长沙-江陵
        map[158] = setMap( jiangling,"江陵",changsha,"长沙");
        // 159武陵
        map[159] = setMap( wuling,"武陵",changsha,"长沙");
        // 160桂阳
        map[160] = setMap( guiyang,"桂阳",changsha,"长沙");

        //161武陵-江陵
        map[161] = setMap( jiangling,"江陵",wuling,"武陵");
        // 162长沙
        map[162] = setMap( changsha,"长沙",wuling,"武陵");
        // 163零陵
        map[163] = setMap( lingling,"零陵",wuling,"武陵");


        //164桂阳-长沙
        map[164] = setMap( changsha,"长沙",guiyang,"桂阳");
        // 165零陵
        map[165] = setMap( lingling,"零陵",guiyang,"桂阳");
        // 166南海
        map[166] = setMap( nanhai,"南海",guiyang,"桂阳");

        //167零陵-武陵
        map[167] = setMap( wuling,"武陵",lingling,"零陵");
        // 168桂阳
        map[168] = setMap( guiyang,"桂阳",lingling,"零陵");
        // 169合浦
        map[169] = setMap( hepu,"合浦",lingling,"零陵");

        //170寿春-谯
        map[170] = setMap( qiao,"谯",shouchun,"寿春");
        // 171下邳
        map[171] = setMap( xiapi,"下邳",shouchun,"寿春");
        // 172广陵
        map[172] = setMap( guangling,"广陵",shouchun,"寿春");
        // 173庐江
        map[173] = setMap( lujiang,"庐江",shouchun,"寿春");
        // 174建业
        map[174] = setMap( jianye,"建业",shouchun,"寿春");
        // 175汝南
        map[174] = setMap( runan,"汝南",shouchun,"寿春");

        //175庐江=江夏
        map[175] = setMap( jiangxia,"江夏",lujiang,"庐江");
        // 176建业
        map[176] = setMap( jianye,"建业",lujiang,"庐江");
        // 177寿春
        map[177] = setMap( shouchun,"寿春",lujiang,"庐江");

        //178建业-广陵
        map[178] = setMap( guangling,"广陵",jianye,"建业");
        // 179寿春
        map[179] = setMap( shouchun,"寿春",jianye,"建业");
        // 180庐江
        map[180] = setMap( lujiang,"庐江",jianye,"建业");
        // 181吴
        map[181] = setMap( wu,"吴",jianye,"建业");
        // 182豫章
        map[182] = setMap( yuzhang,"豫章",jianye,"建业");

        //183吴-建业
        map[183] = setMap( jianye,"建业",wu,"吴");
        // 184广陵
        map[184] = setMap( guangling,"广陵",wu,"吴");
        // 185会稽
        map[185] = setMap( kuaiji,"会稽",wu,"吴");

        //186会稽-吴
        map[186] = setMap( wu,"吴",kuaiji,"会稽");
        // 187豫章
        map[187] = setMap( yuzhang,"豫章",kuaiji,"会稽");
        // 188建安
        map[188] = setMap( jianan,"建安",kuaiji,"会稽");

        //189豫章-江夏
        map[189] = setMap( jiangxia,"江夏",yuzhang,"豫章");
        // 190建业
        map[190] = setMap( jianye,"建业",yuzhang,"豫章");
        // 191会稽
        map[191] = setMap( kuaiji,"会稽",yuzhang,"豫章");
        // 192建安
        map[192] = setMap( jianan,"建安",yuzhang,"豫章");

        //193建安-豫章
        map[193] = setMap( yuzhang,"豫章",jianan,"建安");
        // 194南海
        map[194] = setMap( nanhai,"南海",jianan,"建安");
        // 195会稽
        map[195] = setMap( kuaiji,"会稽",jianan,"建安");

        //196南海-桂阳
        map[196] = setMap( guiyang,"桂阳",nanhai,"南海");
        // 197建安
        map[197] = setMap( jianan,"建安",nanhai,"南海");
        // 198合浦,
        map[198] = setMap( hepu,"合浦",nanhai,"南海");

        //199合浦-交趾
        map[199] = setMap( jiaozhi,"交趾",hepu,"合浦");
        // 200牂牁
        map[200] = setMap( zangke,"牂牁",hepu,"合浦");
        // 201零陵
        map[201] = setMap( lingling,"零陵",hepu,"合浦");
        // 202南海
        map[202] = setMap( nanhai,"南海",hepu,"合浦");

        //203交趾-建宁
        map[203] = setMap( jianning,"建宁",jiaozhi,"交趾");
        // 204合浦
        map[204] = setMap( hepu,"合浦",jiaozhi,"交趾");

        return AV.Object.saveAll(map);
    }).then(function(todos) {
    // 更新成功
    alert("城池路径设置成功");
}, function (error) {
    // 异常处理
    alert(JSON.stringify(error));
    alert("城池路径设置失败");
});
}

function setMap(dest,destCity,src,srcCity){
    var map = new AV.Object('map');
    map.set('src', src);
    map.set('srcCity' , srcCity);
    map.set('dest', dest);
    map.set('destCity' , destCity);
    return map;
}

//重置资源
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
        alert("随机资源设置成功");
    }, function (error) {
        // 异常处理
        alert(JSON.stringify(error));
        alert("随机资源设置失败");
    });
}

function random(){
    var random = (Math.random())*3;
    return round(random, 1);
}

function randomBonus(){
    var random = (Math.random())*5;
    return round(random, 1);
}


/*假如我有一个伤害排行榜，默认值为0。
我需要判断,如果表里没有该用户,新建一条包含伤害的数据。
如果表里有该用户,更新伤害。
那是不是这样
var playerObj = AV.User.current();
var query = new AV.query("leaderBoard");
query.equalTo("user",playObj);  //假设表里的user是pointer
query.find().then((playerData) => {
    //获取到了那就更新
    playerData.increment("damage", 100);
    playerData.save();
}, (error) => {
    //没获取到就新建
    var playerData = new AV.Object.extend("leaderBoard");
    playerData.set("damage", 100);
    playerData.set("user", playerObj);
    playerData.save().then(() => {
    });
});

另外有没有更好的解决办法?我听说如果set主键的话,就可以同时达到存在就获取,不存在就新建,不知道是不是真的
比如这样
var query = new AV.Query('leaderBoard');
query.set('id', 'objectId')
query.increment('damage',100)
query.save();*/



