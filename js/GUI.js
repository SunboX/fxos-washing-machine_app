wm.GUI = (function () {

    'use strict';
    
    var dom = {};

    var pages = {
        SETTINGS: 0,
        TYPE_OF_CLOTHES: 1,
        COLOR_OF_CLOTHES: 2,
        START: 3,
        WASHING: 4
    };

    var showPage = function (page) {
        switch (page) {
        case pages.SETTING:
            break;

        case pages.TYPE_OF_CLOTHES:
            dom.typeOfClothesPage.hidden = false;
            dom.colorOfClothesPage.hidden = true;
            dom.washingPage.hidden = true;
            break;

        case pages.COLOR_OF_CLOTHES:
            break;

        case pages.START:
            break;

        case pages.WASHING:
            break;
        }
    };

    var attachEvents = function () {
        function reqListener() {
            console.log(this.responseText);
        }

        var oReq = new XMLHttpRequest();
        oReq.onload = reqListener;

        dom.typeOfClothesPage.querySelector('.icon-1-1').addEventListener('click', function () {
            oReq.open('get', 'http://192.168.1.139:8080/gpio_set_pin_mode?pin2=toggle', true);
            oReq.send();
        });

        dom.typeOfClothesPage.querySelector('.icon-1-2').addEventListener('click', function () {
            oReq.open('get', 'http://192.168.1.139:8080/gpio_set_pin_mode?pin3=toggle', true);
            oReq.send();
        });
    };

    var init = function () {
        dom.typeOfClothesPage = document.getElementById('type-of-clothes-page');
        dom.colorOfClothesPage = document.getElementById('color-of-clothes-page');
        dom.washingPage = document.getElementById('washing-page');
        attachEvents();
        dom.typeOfClothesPage.hidden = false;
    };

    // public
    return {
        init: init,
        showPage: showPage,
        pages: pages
    };

})();
