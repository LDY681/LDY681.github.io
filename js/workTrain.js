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

function evalWork(){
    var user = AV.Object.createWithoutData('_User', AV.User.current().id);
    user.fetch().then(function(userData){
        var workCount = userData.get("workCount");
        var canWork = userData.get("canWork");

        var workNotifier = $("#workNotifier");
        var onWork = $("#onWork");

        //工作机会还在冷却中
        if (canWork === false && workCount !== 4){
            workNotifier.html( "正在工作中,请下个双整点再来o(*^＠^*)o" );
            workNotifier.addClass("w3-text-red");
            onWork.html( "好嘞(●'◡'●)" );
            onWork.attr("disabled", true);
            onWork.removeClass("w3-green");
            onWork.addClass("w3-grey");
        }else if (workCount === 4){   //今天工作次数已满4次
            workNotifier.html("今天已经工作满4次啦,请明日再来(ง •_•)ง");
            workNotifier.addClass("w3-text-red");
            onWork.html( "好嘞(●'◡'●)" );
            onWork.attr("disabled", true);
            onWork.removeClass("w3-green");
            onWork.addClass("w3-grey");
        }else{
            $("#taskButtonWork").css("display","inline-block");
        }
        $(".workntrainButton").show();
    });
}


function evalTrain(){
    var user = AV.Object.createWithoutData('_User', AV.User.current().id);
    user.fetch().then(function(userData){
        var trainCount = userData.get("trainCount");
        var canTrain = userData.get("canTrain");

        var trainNotifier = $("#trainNotifier");
        var onTrain = $("#onTrain");

        //工作机会还在冷却中
        if (canTrain === false && trainCount !== 4){
            trainNotifier.html( "正在训练中,请下个双整点再来o(*^＠^*)o" );
            trainNotifier.addClass("w3-text-red");
            onTrain.html( "好嘞(●'◡'●)" );
            onTrain.attr("disabled", true);
            onTrain.removeClass("w3-green");
            onTrain.addClass("w3-grey");
        }else if (trainCount === 4){    //今天工作次数已满4次
            trainNotifier.html("今天已经训练满4次啦,请明日再来(ง •_•)ง");
            trainNotifier.addClass("w3-text-red");
            onTrain.html( "好嘞(●'◡'●)" );
            onTrain.attr("disabled", true);
            onTrain.addClass("w3-grey");
            onTrain.removeClass("w3-green");
        }else{
            $("#taskButtonTrain").css("display","inline-block");
        }
        $(".workntrainButton").show();
    });
}