//支持navsideBar的各种展开关闭，点击modal等功能（由navSideBar.html调用）

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

        AV.Cloud.requestMobilePhoneVerify({
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

var navSideBar = {
    userData: []
};

function setProfileData(){
    var query = new AV.Query('_User');
    query.get(AV.User.current().id).then (function (userData){
        console.log("navSideBar userData信息");
        console.log(userData);
        var username = userData.get("username");
        //TODO: get avatar

        // handlebars navSideBar
        navSideBar.userData.push({
            username
        });
        console.log("navSideBar.userData[0]信息");
        console.log(navSideBar.userData[0]);
        // use handlebars to update html
        var source = $("#profileData").html();
        console.log("这里了1");
        var template = Handlebars.compile(source);
        console.log("这里了2");
        var html = template(navSideBar);
        console.log("这里了3");
        $(".profileDataContainer").html(html);
        console.log("这里了4");
    }).catch(function(error) {
        alert(JSON.stringify(error));
    });
}
