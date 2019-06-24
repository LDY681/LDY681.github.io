// 不能直接设置customContent的margin top 不然侧边栏会出错
// 可以设置customContent里面div的margin top

// main是侧边栏右边区域
// mySideBar是侧边栏
// openNav是展开侧边栏按钮
// topNav是顶层菜单栏

function w3_open() {
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
    document.getElementById("topNav").style.marginLeft = "";
}

function w3_close() {
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
