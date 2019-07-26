//支持navsideBar的各种展开关闭，点击modal等功能（由navSideBar.html调用）

// main是侧边栏右边区域
// mySideBar是侧边栏
// openNav是展开侧边栏按钮
// topNav是顶层菜单栏

// 如果导航栏被scroll,重新设定dropDown-content的margin
function setOnScrollMargin() {
    let left = $("#horizontalScroll").scrollLeft();
    $(".onScrollMargin").css({"margin-left": -left})
}

// 在大屏幕下账号设置显示在右上角
function displayRightOnLarge(){
    var largeScreen = window.matchMedia("(min-width: 600px)");
    if (largeScreen.matches) {
        var profile1 = $("#profileSetting");
        profile1.addClass("w3-right");
        profile1.css("display", "inline-block");
    }else{
        var profile2 = $("#profileSetting");
        profile2.css("display", "inline-block");
    }
}

//点击导航栏右侧头像
function showProfile(){
    document.getElementById("profile").style.display = "block";
    setProfileData();
}

//点击手机验证
function showPhoneModal(){
    document.getElementById("verifyPhoneModal").style.display = "block";
}

//显示加入国家modal
function showCountryModal(){
    console.log("showCountryModal触发");
    document.getElementById("CountryModal").style.display = "block";

    var countryPanel = {
        countryData: []
    };

   var query = new AV.Query('country');
    query.ascending('countryId');
    query.find().then (function (countries){
        var countryProcessed = 0;
        countries.forEach(function (country, i, a) {
            var countryName = country.get("cname");
            var countryId = country.get("countryId");
            // handlebars navSideBar
            countryPanel.countryData.push({
                countryName,
                countryId
            });
                countryProcessed++;
            });
        if(countryProcessed === countries.length) {
            compileCountryPanel(countryPanel);
        }
        });
}

function compileCountryPanel(countryPanel){
    $(document).ready(function(){
        var source = $("#countryData").html();
        var template = Handlebars.compile(source);
        var html = template(countryPanel);
        $(".countryDataContainer").html(html);
    });
}

//点击发送短信验证码
function sendVerification(){
    let phoneNumber = $("#phoneNumber");
    // console.log(phoneNumber.val());
    phoneNumber.attr("disabled", true);

    AV.Cloud.requestMobilePhoneVerify({
        mobilePhoneNumber: phoneNumber.val(),
        name: '转世三国',
        op: '手机验证',
        ttl: 10                     // 验证码有效时间为 10 分钟
    }).then(function(res) {
        //调用成功
        // console.log("请求验证码:");
        // console.log(res);
    }, function(error){
        alert(JSON.stringify(error));
    });
}

//点击提交短信验证码
function submitPhone(){
    let smsCode = $("#smsCode").val();
    let phoneNumber = $("#phoneNumber").val();
    let data = {
        mobilePhoneNumber: phoneNumber,
    };
    // console.log("验证码为 "+ smsCode + " 手机号为 "+ phoneNumber);

    AV.Cloud.verifySmsCode(smsCode, phoneNumber).then(function(){
        //验证成功
        // console.log("手机验证码验证成功");
        let current = AV.User.current();
        var query = new AV.Query('_User');
        query.get(current.id).then(function (user) {
            // console.log(user);
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
            //获取user对象，并更新avatar pointer
            var query = new AV.Query('_User');
            query.get(AV.User.current().id).then(function (user) {
                user.set("avatar", avatar);
                user.save();
            });
            $("#avatarNotifier").show();
            setTimeout(function () {
                $("#avatarNotifier").hide()
            }, 1500);
        }, function(error) {
            alert(JSON.stringify(error));
        });
    }
}

//折叠侧边栏
function w3_open() {
    var smallScreen = window.matchMedia("(max-width: 600px)");
    // 如果屏幕小于600px,sideBar全覆盖
    if (smallScreen.matches) {
        document.getElementById("mySidebar").style.width = "100vw";
        document.getElementById("mySidebar").style.display = "block";
        document.getElementById("main").style.display = "none";
    }else{      // 如果屏幕大于600px,sideBar为196px
        document.getElementById("profileSetting").style.display="none";
        // 调整正文内容
        var custom = document.getElementById("customContent");
        if (custom) {
            custom.style.marginLeft = "196px";
        }
        //调整导航侧边栏
        document.getElementById("main").style.marginLeft = "196px";
        document.getElementById("mySidebar").style.width = "196px";
        document.getElementById("mySidebar").style.display = "block";
        document.getElementById("openNav").style.display = 'none';
        document.getElementById("topNav").style.marginLeft = "0";
    }

    let user = AV.User.current();
    var mobileStatus = user.get('mobilePhoneVerified');
    var country = user.get('country');
    if (mobileStatus === false){
        $("#phoneAlert").css("display","block");
    }
    if (country === undefined){
        $("#countryAlert").css("display","block");
    }
}

//展开侧边栏
function w3_close() {
    var smallScreen = window.matchMedia("(max-width: 600px)");
    // 如果屏幕小于600px,sideBar全覆盖
    if (smallScreen.matches) {
        document.getElementById("mySidebar").style.width = "0";
        document.getElementById("mySidebar").style.display = "none";
        document.getElementById("main").style.display = "block";
    }else{
        document.getElementById("profileSetting").style.display="block";
        //调整正文内容
        var custom = document.getElementById("customContent");
        if (custom) {
            custom.style.marginLeft = "0";
        }

        //调整导航侧边栏
        document.getElementById("main").style.marginLeft = "0";
        document.getElementById("mySidebar").style.display = "none";
        document.getElementById("openNav").style.display = "block";
        document.getElementById("openNav").style.marginLeft = "0px";
        document.getElementById("topNav").style.marginLeft = "54px";
    }
}

//填充profile数据
function setProfileData(){
    console.log("setProfileData开始");
    var navSideBar = {
        userData: []
    };

    var query = new AV.Query('_User');
    query.include('avatar');
    query.get(AV.User.current().id).then (function (userData){
        var username = userData.get("username");
        //TODO: get avatar
        var avatar = userData.get("avatar");
        var avatarUrl;
        if (avatar){
            // console.log("有avatar");
            avatarUrl = avatar.get("image").get("url");
        }else{
            // console.log("没有avatar");
            avatarUrl = "http://lc-q48bubuw.cn-e1.lcfile.com/18b3144a7e4a7e11b264.png";
        }

        // handlebars navSideBar
        navSideBar.userData.push({
            username,
            avatarUrl
        });
        // console.log("navSideBar.userData[0]信息");
        // console.log(navSideBar.userData[0]);
        // use handlebars to update html
        $(document).ready(function(){
            // console.log("开始编译navSideBar");
            var source = $("#profileData").html();
            var template = Handlebars.compile(source);
            var html = template(navSideBar);
            $(".profileDataContainer").html(html);
            // console.log("完成编译navSideBar");
        });
    }).catch(function(error) {
        alert(JSON.stringify(error));
    });
}

function countrySelected(event) {
    document.getElementById("selectedCountry").style.display = "block";
    document.getElementById("selectedCountry").href = "../html/country.html?id=" +　event.target.value;
    document.getElementById("countrySubmit").disabled = false;
    document.getElementById("countrySubmit").classList.remove("w3-gray");
    document.getElementById("countrySubmit").classList.add("w3-green");
}

//选择国家
function setupCountry(){
        console.log("开始设置国家");
        var country;
        var countryId = parseInt($("#country").val());
        var query = new AV.Query("country");
        query.equalTo("countryId", countryId);
        query.find().then(function(countries){
            country = countries[0];
            console.log(country.get('cname'));
            var user = AV.User.current();
            user.set("country", country);
            return user.save();
        });
}
