wm.GUI = (function () {

    'use strict';

    let programUuid,
        dom = {};

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
    
    let handleException = function(ex){
        console.log(ex);
    };
    
    let checkState = function(){
        return wm.WashingMachineApi.getState().then(response => {
            
            programUuid = response.programUuid;
            
            console.log(response.state);
            console.log(response.missingData);

            switch (response.state) {
            case wm.WashingMachineApi.state.IDLE:
                dom.typeOfClothesPage.hidden = false;
                break;
            }
        });
    };

    let attachEvents = function () {
        dom.typeOfClothesPage.querySelector('.icon-1-1').addEventListener('click', function () {
            
            wm.WashingMachineApi.setLoadType(programUuid, wm.WashingMachineApi.loadType.HEAVY).then(response => {
                console.log(response.success);
                console.log(response.message);
                if(response.success){
                    checkState();
                }
            }).catch(handleException);
        });
        /*
        dom.typeOfClothesPage.querySelector('.icon-1-2').addEventListener('click', function () {
            wm.WashingMachineApi.setLoadType(wm.WashingMachineApi.loadType.NORMAL).then(checkState).catch(handleException);
        });
        dom.typeOfClothesPage.querySelector('.icon-1-3').addEventListener('click', function () {
            wm.WashingMachineApi.setLoadType(wm.WashingMachineApi.loadType.DELICATES).then(checkState).catch(handleException);
        });
        dom.typeOfClothesPage.querySelector('.icon-1-4').addEventListener('click', function () {
            wm.WashingMachineApi.setLoadType(wm.WashingMachineApi.loadType.WOOL).then(checkState).catch(handleException);
        });
        */
    };

    let init = function () {
        dom.typeOfClothesPage = document.getElementById('type-of-clothes-page');
        /*
        dom.colorOfClothesPage = document.getElementById('color-of-clothes-page');
        dom.washingPage = document.getElementById('washing-page');
        */

        attachEvents();
        checkState();
    };

    // public
    return {
        init: init,
        showPage: showPage,
        pages: pages
    };

})();
