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
    var whichUser = getUrlParam("profile",-1);
    if (whichUser === -1 || whichUser === currUser.get("username")) {
        document.getElementById("profile").style.display = "block";
        setProfileData();
    }
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
    var user = AV.User.current();
    user.setMobilePhoneNumber(phoneNumber.val());
    user.save().then(function(){
        AV.User.requestMobilePhoneVerify(phoneNumber.val()).then(function(res) {
            alert("验证码已发送!");
        }, function(error){
            alert(JSON.stringify(error));
        });
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

    AV.User.verifyMobilePhone(smsCode).then(function() {
        alert("验证成功!准备刷新页面!");
        AV.User.current().fetch().then(function(){
            window.location.reload();
        });
    },function () {
        alert("验证失败!");
    });
}

//设置头像
//Jquery.onSubmit是给form用的，因为setAvatar是个button,所以应该是button.onClick
function setAvatar(){
    console.log("setAvatar开始");
    var file = $('#inputFile')[0].files[0];
    if (!['image/gif', 'image/jpeg', 'image/png'].includes(file['type'])){
        alert("请选择JPG,PNG,GIF格式的头像");
    }else if(file.size > 524288){
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
            console.log("avatarObj"+ JSON.stringify(avatarObj));
            var avatarUrl = avatarObj.get("image").get("url");
            var query = new AV.Query('_User');
            query.get(AV.User.current().id).then(function (user) {
                user.set("avatar", avatar);
                user.save();
                localStorage.setItem('avatarUrl', JSON.stringify({
                    avatarUrl}));
            });
            $("#avatarNotifier").show();
            setTimeout(function () {
                window.location.reload();
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
            avatarUrl = "../img/点我设置头像.jpg";
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
            user.save().then(function(){
                $("#countryNotifier").show();
                document.getElementById("countrySubmit").disabled = true;
                setTimeout(function () {
                    window.location.reload();
                }, 1500);
            });
        });
}

// 请将 AppId 改为你我的 AppId，否则无法本地测试
var appId = 'GWIBfipLqh868acSJVJFbl1q-MdYXbMMI';
var appKey = 'pFE0XYlY4QlTDwlrbbL4IQIY';
//var server = 'https://aaaaaaaa.rtm.lncldglobal.com';

// 请换成你我的一个房间的 conversation id（这是服务器端生成的）
var roomId = '5e6aa817718e8600081f582e';

// 每个客户端自定义的 id
var currUser = AV.User.current();
var clientId = currUser.attributes.name;

// 创建实时通信实例
var realtime = new AV.Realtime({
    appId: appId,
    appKey: appKey,
    plugins: AV.TypedMessagesPlugin,
});
var client;
var messageIterator;

// 用来存储创建好的 roomObject
var room;

// 监听是否服务器连接成功
var firstFlag = true;

// 用来标记历史消息获取状态
var logFlag = false;
var firstNav = true;
var openNav = document.getElementById('openNav');
var sendBtn = document.getElementById('send-btn');
var inputSend = document.getElementById('input-send');
var printWall = document.getElementById('print-wall');

// 拉取历史相关
// 最早一条消息的时间戳
var msgTime;

bindEvent(sendBtn, 'click', sendMsg);

bindEvent(inputSend, 'keydown', function(e) {
    if (e.keyCode === 13) {
        if (firstFlag) {
            login();
        } else {
            sendMsg();
        }
    }
});

bindEvent(openNav, 'click', function(e) {
    if (firstNav === true){
        login();
        firstNav = false;
    }
});

function login() {
    //showLog('正在登录');
    if (!firstFlag) {
        client.close();
        showLog('登录失败!');
    }

    // 创建聊天客户端
    var currUser = AV.User.current();
    realtime.createIMClient(currUser).then(function(c) {
        //showLog('连接成功');
        firstFlag = false;
        client = c;
        client.on('disconnect', function() {
            showLog('[disconnect] 服务器连接已断开');
        });
        client.on('offline', function() {
            showLog('[offline] 离线（网络连接已断开）');
        });
        client.on('online', function() {
            showLog('[online] 已恢复在线');
        });
        client.on('schedule', function(attempt, time) {
            showLog(
                '[schedule] ' +
                time / 1000 +
                's 后进行第 ' +
                (attempt + 1) +
                ' 次重连'
            );
        });
        client.on('retry', function(attempt) {
            showLog('[retry] 正在进行第 ' + (attempt + 1) + ' 次重连');
        });
        client.on('reconnect', function() {
            showLog('[reconnect] 重连成功');
        });
        client.on('reconnecterror', function() {
            showLog('[reconnecterror] 重连失败');
        });
        // 获取对话
        return c.getConversation(roomId);
    })
        .then(function(conversation) {
            if (conversation) {
                return conversation;
            } else {
                // 如果服务器端不存在这个 conversation
                showLog('不存在这个 conversation，创建一个。');
                return client
                    .createConversation({
                        name: 'LeanCloud-Conversation',
                        // 创建暂态的聊天室（暂态聊天室支持无限人员聊天）
                        transient: true,
                    })
                    .then(function(conversation) {
                        showLog('创建新 Room 成功，id 是：', roomId);
                        roomId = conversation.id;
                        return conversation;
                    });
            }
        })
        .then(function(conversation) {
            return conversation.join();
        })
        .then(function(conversation) {
            // 获取聊天历史
            room = conversation;
            messageIterator = conversation.createMessagesIterator();
            getLog(function() {
                showLog('已加入聊天频道');
                console.log('已加入聊天频道');
                setTimeout(function(){
                    printWall.scrollTop = printWall.scrollHeight;
                },500);
            });
            // 房间接受消息
            conversation.on('message', function(message) {
                if (!msgTime) {
                    // 存储下最早的一个消息时间戳
                    msgTime = message.timestamp;
                }
                showMsg(message);
            });
        })
        .catch(function(err) {
            console.error(err);
            showLog('错误：' + err.message);
        });
}

function sendMsg() {
    var val = inputSend.value;

    // 不让发送空字符
    if (
        !String(val)
            .replace(/^\s+/, '')
            .replace(/\s+$/, '')
    ) {
        alert('消息不能为空');
    }

    // 向这个房间发送消息，这段代码是兼容多终端格式的，包括 iOS、Android、Window Phone
    room.send(new AV.TextMessage(val)).then(function(message) {
        // 发送成功之后的回调
        inputSend.value = '';
        showLog(
            '(' + formatTime(message.timestamp) + ')我:',
            encodeHTML(message.text)
        );
        printWall.scrollTop = printWall.scrollHeight;
    });
}

function b64EncodeUnicode(str) {
    return btoa(
        encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
            return String.fromCharCode('0x' + p1);
        })
    );
}

Usernames = {
    _cache: {},
    get: function(id) {
        if (!this._cache[id]) {
            this._cache[id] = new AV.Query(AV.User)
                .get(id)
                .then(
                    function(user) {
                        var username = user.getUsername();
                        this._cache[id] = username;
                        return username;
                    }.bind(this)
                )
                .catch(
                    function() {
                        this._cache[id] = id;
                        return id;
                    }.bind(this)
                );
        }
        return this._cache[id];
    },
};

// 显示接收到的信息
function showMsg(message, isBefore) {
    var text = message.text;
    AV.Promise.resolve()
        .then(function() {
            return Usernames.get(message.from);
        })
        .then(function(from) {
            if (message instanceof AV.TextMessage) {
                if (
                    String(text)
                        .replace(/^\s+/, '')
                        .replace(/\s+$/, '')
                ) {
                    showLog(
                        '(' +
                        formatTime(message.timestamp) +
                        ')' +
                        encodeHTML(from) +
                        ':',
                        encodeHTML(message.text),
                        isBefore
                    );
                }
            } else if (message instanceof AV.FileMessage) {
                showLog(
                    '（' +
                    formatTime(message.timestamp) +
                    '）  ' +
                    encodeHTML(from) +
                    '： ',
                    createLink(message.getFile().url()),
                    isBefore
                );
            }
        });
}

// 拉取历史
bindEvent(printWall, 'scroll', function(e) {
    if (printWall.scrollTop < 20) {
        getLog();
    }
});

// 获取消息历史
function getLog(callback) {
    var height = printWall.scrollHeight;
    if (logFlag) {
        return;
    } else {
        // 标记正在拉取
        logFlag = true;
    }
    messageIterator
        .next()
        .then(function(result) {
            var data = result.value;
            logFlag = false;
            // 存储下最早一条的消息时间戳
            var l = data.length;
            if (l) {
                msgTime = data[0].timestamp;
            }
            for (var i = l - 1; i >= 0; i--) {
                showMsg(data[i], true);
            }
            if (l) {
                printWall.scrollTop = printWall.scrollHeight - height;
            }
            if (callback) {
                callback();
            }
        })
        .catch(function(err) {
            console.error(err);
        });
}

// demo 中输出代码
function showLog(msg, data, isBefore) {
    if (data) {
        // console.log(msg, data);
        msg = msg + '<span class="strong">' + data + '</span>';
    }
    var p = document.createElement('p');
    p.innerHTML = msg;
    p.style.fontSize="12px";
    if (isBefore) {
        printWall.insertBefore(p, printWall.childNodes[0]);
    } else {
        printWall.appendChild(p);
    }
}

function encodeHTML(source) {
    return String(source)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\\/g, '&#92;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function formatTime(time) {
    var date = new Date(time);
    var month =
        date.getMonth() + 1 < 10
            ? '0' + (date.getMonth() + 1)
            : date.getMonth() + 1;
    var currentDate = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var hh = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    var mm = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    var ss = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    return (
        hh +
        ':' +
        mm
    );
}

function createLink(url) {
    return (
        '<a target="_blank" href="' +
        encodeHTML(url) +
        '">' +
        encodeHTML(url) +
        '</a>'
    );
}

function bindEvent(dom, eventName, fun) {
    if (window.addEventListener) {
        dom.addEventListener(eventName, fun);
    } else {
        dom.attachEvent('on' + eventName, fun);
    }
}

