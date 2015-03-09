wm.GUI = (function () {

    'use strict';
    
    let dom = {};

    let pages = {
        SETTINGS: 0,
        LOAD_TYPE: 1,
        LOAD_COLOR: 2,
        START: 3,
        WASHING: 4
    };
    
    let showPage = function (page) {
        switch (page) {
        case pages.SETTING:
            break;

        case pages.LOAD_TYPE:
            dom.typeOfClothesPage.hidden = false;
            dom.colorOfClothesPage.hidden = true;
            dom.washingPage.hidden = true;
            break;

        case pages.LOAD_COLOR:
            break;

        case pages.START:
            break;

        case pages.WASHING:
            break;
        }
    };

    let attachEvents = function () {
        dom.typeOfClothesPage.querySelector('.icon-1-1').addEventListener('click', function () {
            wm.WashingMachineApi.setLoadType(wm.WashingMachineApi.loadType.HEAVY);
        });
        dom.typeOfClothesPage.querySelector('.icon-1-2').addEventListener('click', function () {
            wm.WashingMachineApi.setLoadType(wm.WashingMachineApi.loadType.NORMAL);
        });
        dom.typeOfClothesPage.querySelector('.icon-1-3').addEventListener('click', function () {
            wm.WashingMachineApi.setLoadType(wm.WashingMachineApi.loadType.DELICATES);
        });
        dom.typeOfClothesPage.querySelector('.icon-1-4').addEventListener('click', function () {
            wm.WashingMachineApi.setLoadType(wm.WashingMachineApi.loadType.WOOL);
        });
    };

    let init = function () {
        dom.typeOfClothesPage = document.getElementById('type-of-clothes-page');
        dom.colorOfClothesPage = document.getElementById('color-of-clothes-page');
        dom.washingPage = document.getElementById('washing-page');
        
        attachEvents();
        
        console.log('init');
        
        wm.WashingMachineApi.getState().then(response => {
            switch (response.state){
                case wm.WashingMachineApi.state.IDLE:
                    dom.typeOfClothesPage.hidden = false;
                    break;
            }
        });
    };

    // public
    return {
        init: init,
        showPage: showPage,
        pages: pages
    };

})();
