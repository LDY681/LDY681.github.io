function fetchEquipInfo(){
    var user = AV.Object.createWithoutData('_User', AV.User.current().id);
    user.fetch({ include: ['equip'] }).then(function (user) {
        var equip = user.get('equip');
        var helmet = equip.get('helmet');
        var armor = equip.get('armor');
        var shoes = equip.get('shoes');
        var offhand = equip.get('offhand');
        var horse = equip.get('horse');
        var hidden = equip.get('hidden');
        var shield = equip.get('shield');
        var sword = equip.get('sword');
        var spear = equip.get('spear');
        var bow = equip.get('bow');

        localStorage.setItem('equip', JSON.stringify({
            helmet,
            armor,
            shoes,
            offhand,
            horse,
            hidden,
            shield,
            sword,
            spear,
            bow
        }));
        //使用方法
        // var user = JSON.parse(localStorage.getItem('user'));

        return new Promise((resolve, reject) => {
            if (JSON.parse(localStorage.getItem('equip') === undefined)){
                reject("Equip doesn't exist");
                return;
            }
            resolve("DONE!");
        });

    });
}


