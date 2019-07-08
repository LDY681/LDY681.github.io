//支持navsideBar的各种展开关闭，点击modal等功能（由navSideBar.html调用）

// main是侧边栏右边区域
// mySideBar是侧边栏
// openNav是展开侧边栏按钮
// topNav是顶层菜单栏

//点击导航栏右侧头像
function showProfile(){
    document.getElementById("profile").style.display = "block";
}
//点击手机验证
function showPhoneModal(){
    document.getElementById("verifyPhoneModal").style.display = "block";
}
//点击发送验证码
function sendVerification(){
    let phoneNumber = $("#phoneNumber");
    console.log(phoneNumber.val());
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
}

//点击提交验证码
function submitPhone(){
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
}

//设置头像
//Jquery.onSubmit是给form用的，因为setAvatar是个button,所以应该是button.onClick
function setAvatar(){
    var file = $('#inputFile')[0].files[0];
    if (file.size > 524288){
        alert("请选择小于500KB的头像");
    }else{
        console.log("通过文件大小检测");
        //TODO 检测之前是否已经有avatar
        var name = file.name;
        var avFile = new AV.File(name, file);

        //声明类型
        var Avatar = AV.Object.extend('avatar');
        //新建对象
        var avatar = new Avatar();
        // 将用户添加至头像
        avatar.set("owner", AV.User.current());
        avatar.set("image", avFile);
        avatar.save().then(function(avatarObj){
            console.log("avatar上传成功,返回值:");
            console.log(avatarObj);
            //获取user对象，并更新avatar pointer
            var query = new AV.Query('_User');
            query.get(AV.User.current().id).then(function (user) {
                console.log("get到了,值为:");
                console.log(user);
                user.set("avatar", avatar);
                user.save();
            });
            $("#avatarNotifier").show();
        }, function(error) {
            alert(JSON.stringify(error));
        });
    }
}

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

function setProfileData(){
    var navSideBar = {
        userData: []
    };

    var query = new AV.Query('_User');
    query.include('avatar');
    query.get(AV.User.current().id).then (function (userData){
        var username = userData.get("username");
        //TODO: get avatar
        var avatar = userData.get("avatar").get("image");

        var avatarUrl;
        if (avatar){
            avatarUrl = avatar.get("url");
        }else{
            avatarUrl = "../img/logo.png";
        }

        // handlebars navSideBar
        navSideBar.userData.push({
            username,
            avatarUrl
        });
        console.log("navSideBar.userData[0]信息");
        console.log(navSideBar.userData[0]);
        // use handlebars to update html
        $(document).ready(function(){
            console.log("开始编译navSideBar");
            var source = $("#profileData").html();
            var template = Handlebars.compile(source);
            var html = template(navSideBar);
            $(".profileDataContainer").html(html);
            console.log("完成编译navSideBar");
        });
    }).catch(function(error) {
        alert(JSON.stringify(error));
    });
}
