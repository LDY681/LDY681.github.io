// 第一个promise user.fetch也要return,不然promise是undefined

//获取用户装备信息并填充
function fetchAndPopulate(){
    fetchEquipInfo().then(function(res){
        populateEquipInfo().then((function(error){
            alert(JSON.stringify(error));
        }));
    }, (function(error){
        alert(JSON.stringify(error));
    }));
}

//将装备信息储存到本地存储
function fetchEquipInfo(){
    var user = AV.User.current();
    return user.fetch({ include: ['equip'] }).then(function (user) {
        var equip = user.get('equip');
        var helmet = equip.get('helmet');
        var armor = equip.get('armor');
        var shoes = equip.get('shoes');
        var offhand = equip.get('offhand');
        var horse = equip.get('horse');
        var horseHelmet = equip.get('horseHelmet');
        var horseSaddle = equip.get('horseSaddle');
        var shield = equip.get('shield');
        var sword = equip.get('sword');
        var spear = equip.get('spear');
        var bow = equip.get('bow');
        var equipUp = user.get("equipUp");
        var horseUp = user.get("horseUp");
        var weaponUp = user.get("weaponUp");
        var horseSaddleUp = user.get('horseSaddleUp');
        var horseHelmetUp = user.get('horseHelmetUp');
        localStorage.setItem('equip', JSON.stringify({
            helmet,
            armor,
            shoes,
            offhand,
            horse,
            horseHelmet,
            horseSaddle,
            shield,
            sword,
            spear,
            bow,
            equipUp,
            horseUp,
            weaponUp,
            horseSaddleUp,
            horseHelmetUp
        }));
        //使用方法
        // var user = JSON.parse(localStorage.getItem('user'));

        return new Promise(function(resolve, reject) {
            if (JSON.parse(localStorage.getItem('equip')) === undefined){
                reject(new Error("Equip doesn't exist"));
            }else{
                resolve();
            }
        });
    });
}

//从localstorage获得装备信息
function populateEquipInfo(){

    var equip = localStorage.getItem("equip");
    $("#helmet").html(JSON.parse(equip).helmet);
    $("#armor").html(JSON.parse(equip).armor);
    $("#shoes").html(JSON.parse(equip).shoes);
    $("#offhand").html(JSON.parse(equip).offhand);
    $("#horse").html(JSON.parse(equip).horse);
    $("#horseSaddle").html(JSON.parse(equip).horseSaddle);
    $("#horseHelmet").html(JSON.parse(equip).horseHelmet);
    $("#shield").html(JSON.parse(equip).shield);
    $("#sword").html(JSON.parse(equip).sword);
    $("#spear").html(JSON.parse(equip).spear);
    $("#bow").html(JSON.parse(equip).bow);
    $("#equipUpAmount").html(JSON.parse(equip).equipUp);
    $("#horseUpAmount").html(JSON.parse(equip).horseUp);
    $("#horseHelmetUpAmount").html(JSON.parse(equip).horseHelmetUp);
    $("#horseSaddleUpAmount").html(JSON.parse(equip).horseSaddleUp);
    $("#weaponUpAmount").html(JSON.parse(equip).weaponUp);
    var equipUp = JSON.parse(equip).equipUp;
    var horseUp = JSON.parse(equip).horseUp;
    var weaponUp = JSON.parse(equip).weaponUp;
    //判断哪些装备是可以升级的
    var table = document.getElementById("eqTable");
    for (var i = 0, row; row = table.rows[i]; i++) {

        //排除table header
        if (i !== 0 && i !== 5 && i !== 8){
            console.log("当前装备为: " + row.cells[0].innerHTML);
            //获取当前装备等级
            var level = row.cells[2].innerHTML;

            //判断当前装备升级所需道具
            var Consumables = calculateConsumables(level);
            console.log("当前i为:" + i );

            if (i <= 5){     //如果是装备类型
                var helmet = $("#helmetUp");
                var armor = $("#armorUp");
                var shoes = $("#shoesUp");
                var offhand = $("#offhandUp");
                var shield = $("#shieldUp");
                console.log("equipUp");
                console.log(equipUp);
                if (equipUp >= Consumables){    //如果道具数量大于等于预计消耗数量
                    switch (i){
                        case 1:
                            helmet.removeAttr("disabled");
                            helmet.html("点我强化");
                            break;
                        case 2:
                            armor.removeAttr("disabled");
                            armor.html("点我强化");
                            break;
                        case 3:
                            shoes.removeAttr("disabled");
                            shoes.html("点我强化");
                            break;
                        case 4:
                            offhand.removeAttr("disabled");
                            offhand.html("点我强化");
                            break;
                        case 5:
                            shield.removeAttr("disabled");
                            shield.html("点我强化");
                            break;
                        default:
                            offhand.removeAttr("disabled");
                            offhand.html("点我强化");
                    }
                }else {        //如果道具数量小于预计消耗数量
                    switch (i) {
                        case 1:
                            helmet.attr("disabled", true);
                            helmet.html("道具不足");
                            break;
                        case 2:
                            armor.attr("disabled", true);
                            armor.html("道具不足");
                            break;
                        case 3:
                            shoes.attr("disabled", true);
                            shoes.html("道具不足");
                            break;
                        case 4:
                            offhand.attr("disabled", true);
                            offhand.html("道具不足");
                            break;
                        case 5:
                            shield.attr("disabled", true);
                            shield.html("道具不足");
                            break;
                        default:
                            offhand.attr("disabled", true);
                            offhand.html("道具不足");
                    }
                }
            } else if (i <= 9){     //如果是武器类型

                var sword = $("#swordUp");
                var spear = $("#spearUp");
                var bow = $("#bowUp");
                if (weaponUp >= Consumables){    //如果道具数量大于等于预计消耗数量
                    switch (i){

                        case 7:
                            sword.removeAttr("disabled");
                            sword.html("点我强化");
                            break;
                        case 8:
                            spear.removeAttr("disabled");
                            spear.html("点我强化");
                            break;
                        case 9:
                            bow.removeAttr("disabled");
                            bow.html("点我强化");
                            break;
                        default:
                            bow.removeAttr("disabled");
                            bow.html("点我强化");
                    }
                }else{
                    switch (i){
                        case 7:
                            sword.attr("disabled", true);
                            sword.html("道具不足");
                            break;
                        case 8:
                            spear.attr("disabled", true);
                            spear.html("道具不足");
                            break;
                        case 9:
                            bow.attr("disabled", true);
                            bow.html("道具不足");
                            break;
                        default:
                            bow.attr("disabled", true);
                            bow.html("道具不足");
                    }
                }
            }else{  //如果是坐骑类型
                var horseHelmet = $("#horseHelmetUp");
                var horseSaddle = $("#horseSaddleUp");
                var horse = $("#horseUp");
                if (horseUp >= Consumables){    //如果道具数量大于等于预计消耗数量
                    switch (i){
                        case 11:
                            horseHelmet.removeAttr("disabled");
                            horseHelmet.html("点我强化");
                            break;
                        case 12:
                            horseSaddle.removeAttr("disabled");
                            horseSaddle.html("点我强化");
                            break;
                        case 13:
                            horse.removeAttr("disabled");
                            horse.html("点我强化");
                            break;
                        default:
                            horse.removeAttr("disabled");
                            horse.html("点我强化");
                    }
                }else{
                    switch (i){
                        case 11:
                            horseHelmet.attr("disabled", true);
                            horseHelmet.html("道具不足");
                            break;
                        case 12:
                            horseSaddle.attr("disabled", true);
                            horseSaddle.html("道具不足");
                            break;
                        case 13:
                            horse.attr("disabled", true);
                            horse.html("道具不足");
                            break;
                        default:
                            horse.attr("disabled", true);
                            horse.html("道具不足");
                    }
                }

            }   //end of else
        }   //end of 排除table header

    }
}

$(function(){
    $("#helmetUp").on("click", function(){
        upgradeEquip("helmet");
    });
    $("#armorUp").on("click",
        function(){
            upgradeEquip("armor");
        });
    $("#shoesUp").on("click", function(){
        upgradeEquip("shoes");
    });
    $("#offhandUp").on("click", function(){
        upgradeEquip("offhand");
    });
    $("#horseUp").on("click", function(){
        upgradeEquip("horse");
    });
    $("#hiddenUp").on("click", function(){
        upgradeEquip("hidden");
    });
    $("#shieldUp").on("click", function(){
        upgradeEquip("shield");
    });
    $("#swordUp").on("click", function(){
        upgradeEquip("sword");
    });
    $("#spearUp").on("click", function(){
        upgradeEquip("spear");
    });
    $("#bowUp").on("click", function(){
        upgradeEquip("bow");
    });
});

//点击装备升级时触发
function upgradeEquip(equip){
    var Equip = equip;
        var localEQ = localStorage.getItem("equip");
        //获取等级
        var level = 0;
        switch (Equip) {
            case "helmet":
                level = JSON.parse(localEQ).helmet;
                break;
            case "armor":
                level = JSON.parse(localEQ).armor;
                break;
            case "shoes":
                level = JSON.parse(localEQ).shoes;
                break;
            case "offhand":
                level = JSON.parse(localEQ).offhand;
                break;
            case "horse":
                level = JSON.parse(localEQ).horse;
                break;
            case "hidden":
                level = JSON.parse(localEQ).hidden;
                break;
            case "shield":
                level = JSON.parse(localEQ).shield;
                break;
            case "spear":
                level = JSON.parse(localEQ).spear;
                break;
            case "sword":
                level = JSON.parse(localEQ).sword;
                break;
            case "bow":
                level = JSON.parse(localEQ).bow;
                break;
            default:
                level = JSON.parse(localEQ).helmet;
                break;
        }
        var chance = 1 - level * 0.1;
        var random = Math.random();
        var consumables = calculateConsumables(level);
        var user = AV.User.current();
        user.fetch({ include: ['equip']});
        if (random <= chance){   //升级成功
            //判断升级的装备
            switch (Equip){
                //消耗equipUp,等级提升
                case "helmet":
                case "armor":
                case "shoes":
                case "offhand":
                    if (user.get('equipUp') < consumables){
                        alert("升级失败,道具数量不足!");
                        break;
                    }
                    user.increment('equipUp', -consumables);
                    user.get('equip').increment(Equip, 1);
                    user.save().then(function(res){
                        fetchAndPopulate();
                        showSuccess();
                    }, (function(error){
                        alert("运气好,但升级失败,道具数量不足!");
                    }));
                    break;

                case "horse":
                case "hidden":
                    if (user.get('horseUp') < consumables){
                        alert("升级失败,道具数量不足!");
                        break;
                    }
                    user.increment('horseUp', -consumables);
                    user.get('equip').increment(Equip, 1);
                    user.save().then(function(res){
                        fetchAndPopulate();
                        showSuccess();
                    }, (function(error){
                        alert("运气好,但升级失败,道具数量不足!");
                    }));
                    break;

                case "shield":
                case "spear":
                case "sword":
                case "bow":
                    if (user.get('weaponUp') < consumables){
                        alert("升级失败,道具数量不足!");
                        break;
                    }
                    user.increment('weaponUp', -consumables);
                    user.get('equip').increment(Equip, 1);
                    user.save().then(function(res){
                        fetchAndPopulate();
                        showSuccess();
                    }, (function(error){
                        alert("运气好,但升级失败,道具数量不足!");
                    }));
                    break;
                default:
                    break;
            }
        }else{  //升级失败

            //判断升级的装备
            switch (Equip){
                //消耗equipUp,等级提升
                case "helmet":
                case "armor":
                case "shoes":
                case "offhand":
                    if (user.get('equipUp') < consumables){
                        alert("升级失败,道具数量不足!");
                        break;
                    }
                    user.increment('equipUp', -consumables);
                    user.save().then(function(res){
                        fetchAndPopulate();
                        showFailure();
                    }, (function(error){
                        alert("运气差,消耗失败,道具数量不足!");
                    }));
                    break;

                case "horse":
                case "hidden":
                    if (user.get('horseUp') < consumables){
                        alert("升级失败,道具数量不足!");
                        break;
                    }
                    user.increment('horseUp', -consumables);
                    user.save().then(function(res){
                        fetchAndPopulate();
                        showFailure();
                    }, (function(error){
                        alert("运气差,消耗失败,道具数量不足!");
                    }));
                    break;

                case "shield":
                case "spear":
                case "sword":
                case "bow":
                    if (user.get('weaponUp') < consumables){
                        alert("升级失败,道具数量不足!");
                        break;
                    }
                    user.increment('weaponUp', -consumables);
                    user.save().then(function(res){
                        fetchAndPopulate();
                        showFailure();
                    }, (function(error){
                        alert("运气差,消耗失败,道具数量不足!");
                    }));
                    break;
                default:
                    break;
            }
        }
}

//计算消耗升级道具数量
function calculateConsumables(level){
    return Math.pow(2,level);
}

//提示装备升级成功
function showSuccess(){
    $(".successNotifier").show();

    setTimeout(function () {
        $(".successNotifier").hide()
    }, 800);
    
}

//提示装备升级失败
function showFailure(){
    $(".failureNotifier").show();

    setTimeout(function () {
        $(".failureNotifier").hide()
    }, 800);
}

