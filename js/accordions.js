// 确保调用accordionOn和Off的所有element都有initialize w3-hide 或 w3-show
// 展开accordion;用法:accordionOn(element id)
function accordionOn(id) {
    var x = document.getElementById(id)
    if (x.className.indexOf("w3-hide") !== -1) {
        x.className = x.className.replace("w3-hide", "w3-show");
    }
}
// 关闭accordion;用法:accordionOff(element id)
function accordionOff(id) {
    var x = document.getElementById(id);
    if (x.className.indexOf("w3-show") !== -1) {
        x.className = x.className.replace("w3-show", "w3-hide");
    }
}

