$(function(){
    $("#onWork").on("click",function(e) {
        e.preventDefault();
        work();
    });
    $("#onTrain").on("click",function(e) {
        e.preventDefault();
        train();
    });
});

//工作
function work(){
    console.log("要work了,看下效果");
    var query = new AV.Query('_User');
    query.get(AV.User.current().id).then (function (userData){
        if (userData.attributes.workCount !== 4){  //如果当日工作次数未满
            if (userData.attributes.canWork === true){ //如果没有工作冷却
                // 设置canwork,workcount
                userData.set('canWork',false);
                userData.increment('workCount', 1);

                // 设置ecoSkill和exp增加
                var eco = userData.attributes.ecoSkill;
                var ecoIncrement,expIncrement;
                if (eco <= 10){
                    ecoIncrement = 1;
                    expIncrement = 10;
                }else if (eco > 10 && eco <= 15){
                    ecoIncrement = 0.5;
                    expIncrement = 5;
                }else if (eco > 15 && eco <= 20){
                    ecoIncrement = 0.2;
                    expIncrement = 3;
                }else if (eco > 20 && eco <= 30){
                    ecoIncrement = 0.1;
                    expIncrement = 2;
                }else {
                    ecoIncrement = 0.05;
                    expIncrement = 1;
                }
                userData.increment('ecoSkill', ecoIncrement);
                userData.increment('exp', expIncrement);

                // 保存的时候先fetch以下
                userData.fetchWhenSave(true);
                return userData.save().then(function(){
                    $(".successNotifier").show();
                    setTimeout(function () {
                        $(".successNotifier").hide()
                    }, 1500);
                });
            }else{
                alert("每个双整点只能工作一次哦!");
            }
        }else{
            alert("棒棒哒!您今天工作已满4次,请明日再来!");
        }
    }).then(function(){
        console.log("工作状态保存成功!");
    },function(){
        alert("网络异常或您在多台机器同时点击!");
    });
}

function train(){
    console.log("要train了,看下效果");
    var query = new AV.Query('_User');
    query.get(AV.User.current().id).then (function (userData){
        if (userData.attributes.trainCount !== 4){
            if (userData.attributes.canTrain === true){
                // 设置canTrain,traincount
                userData.set('canTrain',false);
                userData.increment('trainCount', 1);

                // 设置ecoSkill和exp增加
                var str = userData.attributes.str;
                var strIncrement,expIncrement;
                if (str <= 1000){
                    strIncrement = 100;
                    expIncrement = 10;
                }else if (str > 1000 && str <= 1500){
                    strIncrement = 50;
                    expIncrement = 5;
                }else if (str > 1500 && str <= 2000){
                    strIncrement = 20;
                    expIncrement = 3;
                }else if (str > 2000 && str <= 3000){
                    strIncrement = 10;
                    expIncrement = 2;
                }else {
                    strIncrement = 5;
                    expIncrement = 1;
                }
                userData.increment('str', strIncrement);
                userData.increment('exp', expIncrement);

                // 保存的时候先fetch以下
                userData.fetchWhenSave(true);
                return userData.save().then(function(){
                    $(".successNotifier").show();
                    setTimeout(function () {
                        $(".successNotifier").hide()
                    }, 1500);
                });
            }else{
                alert("每个双整点只能训练一次哦!");
            }
        }else{
            alert("棒棒哒!您今天训练已满4次,请明日再来!");
        }
    }).then(function(){
        console.log("训练状态保存成功!");
    },function(){
        alert("网络异常或您在多台机器同时点击!");
    });
}