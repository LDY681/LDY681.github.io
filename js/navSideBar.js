// 不能直接设置customContent的margin top 不然侧边栏会出错
// 可以设置customContent里面div的margin top

// main是侧边栏右边区域
// mySideBar是侧边栏
// openNav是展开侧边栏按钮
// topNav是顶层菜单栏

$(function() {
    $("#profileSetting").on('click', function (e) {
        e.preventDefault();
        $("#profile").css("display", "block");
    });
    $("#phoneAlert").on('click', function (e) {
        e.preventDefault();
        $("#verifyPhoneModal").css("display", "block");
    });
    $("#sendVerification").on('click', function (e) {
        e.preventDefault();
        let phoneNumber = $("#phoneNumber");
         console.log(phoneNumber.val());
        let params = {
            mobilePhoneNumber: phoneNumber.val(), //string
        }
        phoneNumber.attr("disabled", true);

        AV.Cloud.requestSmsCode({
            mobilePhoneNumber: phoneNumber.val(),
            name: '转世三国',
            op: '手机验证',
            ttl: 10                     // 验证码有效时间为 10 分钟
        }).then(function(res) {
            //调用成功
            console.log("请求验证码:");
            console.log(res);
        }, function(error){
            alert(JSON.stringify(error));
        });

/*        Bmob.requestSmsCode(params).then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            switch (error.code){
                case 301:
                 alert("手机号码必须是11位的数字");
                 break;
                default:
                    alert("发送失败,请重新再试");
            }
            console.log(error);
        });*/

    });
    $("#submitPhone" ).on('click', function(e) {
        e.preventDefault();
        let smsCode = $("#smsCode").val();
        let phoneNumber = $("#phoneNumber").val();
        let data = {
            mobilePhoneNumber: phoneNumber,
        };
        console.log("验证码为 "+ smsCode + " 手机号为 "+ phoneNumber);

        AV.Cloud.verifySmsCode(smsCode, phoneNumber).then(function(){
            //验证成功
            console.log("手机验证码验证成功");
            let current = AV.User.current();
            var query = new AV.Query('_User');
            query.get(current.id).then(function (user) {
                console.log(user);
                user.set("mobilePhoneVerified", true);
                user.set("mobilePhoneNumber", phoneNumber);
                user.save().then(function(){

                },function(error){
                    alert(JSON.stringify(error));
                });
                alert("验证成功!准备刷新页面!");
                // window.location.reload();

            }, function(err){
                //验证失败
                alert(JSON.stringify(err));
            })
        }, function(err){
            //验证失败
            alert(JSON.stringify(err));
        });

       /* Bmob.verifySmsCode(smsCode, data).then(function (response) {
            let current = Bmob.User.current();
            console.log("当前用户名为" + current.name);
            let query = Bmob.Query('_User');
            query.get(current.objectId).then(res => {
                console.log(res);
                res.set('mobilePhoneNumber',phoneNumber);
                res.set('mobilePhoneNumberVerified',true);
                res.save();
            }).catch(err => {
                console.log(err);
            });
            alert("验证成功!准备刷新页面!");
            window.location.reload();
            console.log(response);
        }).catch(function (error) {alert(error.error);console.log(error);});*/
    });
});

function w3_open() {
    // 调整正文内容
    var custom = document.getElementById("customContent");
    if (custom) {
        if (custom.className.indexOf("w3-animate-left") === -1) {
            custom.className += " w3-animate-left";
        }
        custom.style.marginLeft = "196px";
    }

    //调整导航侧边栏
    document.getElementById("main").style.marginLeft = "196px";
    document.getElementById("mySidebar").style.width = "196px";
    document.getElementById("mySidebar").style.display = "block";
    document.getElementById("openNav").style.display = 'none';
    document.getElementById("topNav").style.marginLeft = "";

    let current = AV.User.current();
    console.log("当前用户为:");
    console.log(current);
    var mobileStatus = current.get('mobilePhoneVerified');
    console.log("手机是否验证");
    console.log(mobileStatus);
    if (mobileStatus === false){
        $("#phoneAlert").css("display","block");
    }


    // var query = new AV.Query('_User');
    // query.get(current).then(res => {
    //     console.log("手机号是否验证");
    //
    //     if (res.mobilePhoneNumberVerified == null ){
    //         $("#phoneAlert").css("display","block");
    //     }
    // }).catch(err => {
    //     console.log(err);
    // });
}

function w3_close() {
    //调整正文内容
    var custom = document.getElementById("customContent");
    if (custom) {
        if (custom.className.indexOf("w3-animate-left") !== -1) {
            custom.className = custom.className.replace(" w3-animate-left", "");
        }
        custom.style.marginLeft = "0";
    }

    //调整导航侧边栏
    document.getElementById("main").style.marginLeft = "0";
    document.getElementById("mySidebar").style.display = "none";
    document.getElementById("openNav").style.display = "block";
    document.getElementById("openNav").style.marginLeft = "0px";
    document.getElementById("topNav").style.marginLeft = "54px";
}


