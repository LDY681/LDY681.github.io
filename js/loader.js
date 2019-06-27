function loader() {
    var myVar;
    myVar = setTimeout(showPage, 3000);
}

function showPage() {
    document.getElementById("loader").style.display = "none";
    document.getElementById("afterLoading").style.display = "block";
}