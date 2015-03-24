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
            dom.typeOfClothesPage.hidden = true;
            dom.colorOfClothesPage.hidden = false;
            dom.washingPage.hidden = true;
            break;

        case pages.START:
            dom.typeOfClothesPage.hidden = true;
            dom.colorOfClothesPage.hidden = true;
            dom.washingPage.hidden = false;
            break;

        case pages.WASHING:
            break;
        }
    };

    let handleException = function (ex) {
        console.log(ex);
    };

    let checkState = function () {
        return wm.WashingMachineApi.getState().then(response => {

            programUuid = response.programUuid;

            console.log(response.state);
            console.log(response.missingData);

            switch (response.state) {
            case wm.WashingMachineApi.state.IDLE:
                showPage(pages.LOAD_TYPE);
                break;
            case wm.WashingMachineApi.state.COLLECTING_DATA:
                if (response.missingData.indexOf('LOAD_TYPE') > -1) {
                    showPage(pages.LOAD_TYPE);
                } else if (response.missingData.indexOf('LOAD_COLOR') > -1) {
                    showPage(pages.LOAD_COLOR);
                } else {
                    showPage(pages.START);
                }
                break;
            }
        });
    };

    let attachEvents = function () {
        dom.settings.addEventListener('click', function () {
            location.reload();
        });

        // Type of clothes page
        dom.typeOfClothesPage.querySelector('.icon-1-1').addEventListener('click', function () {
            wm.WashingMachineApi.setLoadType(programUuid, wm.WashingMachineApi.loadType.HEAVY).then(response => {
                if (response.success) {
                    checkState();
                }
            }).catch(handleException);
        });
        dom.typeOfClothesPage.querySelector('.icon-1-2').addEventListener('click', function () {
            wm.WashingMachineApi.setLoadType(programUuid, wm.WashingMachineApi.loadType.NORMAL).then(response => {
                if (response.success) {
                    checkState();
                }
            }).catch(handleException);
        });
        dom.typeOfClothesPage.querySelector('.icon-1-3').addEventListener('click', function () {
            wm.WashingMachineApi.setLoadType(programUuid, wm.WashingMachineApi.loadType.DELICATES).then(response => {
                if (response.success) {
                    checkState();
                }
            }).catch(handleException);
        });
        dom.typeOfClothesPage.querySelector('.icon-1-4').addEventListener('click', function () {
            wm.WashingMachineApi.setLoadType(programUuid, wm.WashingMachineApi.loadType.WOOL).then(response => {
                if (response.success) {
                    checkState();
                }
            }).catch(handleException);
        });

        // Color of clothes page
        dom.colorOfClothesPage.querySelector('.icon-2-1').addEventListener('click', function () {
            wm.WashingMachineApi.setLoadColor(programUuid, wm.WashingMachineApi.loadColor.WHITE).then(response => {
                if (response.success) {
                    checkState();
                }
            }).catch(handleException);
        });
        dom.colorOfClothesPage.querySelector('.icon-2-2').addEventListener('click', function () {
            wm.WashingMachineApi.setLoadColor(programUuid, wm.WashingMachineApi.loadColor.BLACK).then(response => {
                if (response.success) {
                    checkState();
                }
            }).catch(handleException);
        });
        dom.colorOfClothesPage.querySelector('.icon-2-3').addEventListener('click', function () {
            wm.WashingMachineApi.setLoadColor(programUuid, wm.WashingMachineApi.loadColor.COLORED).then(response => {
                if (response.success) {
                    checkState();
                }
            }).catch(handleException);
        });

        // Washing page
        document.getElementById('icon-stop').addEventListener('click', function () {
            wm.WashingMachineApi.stop().then(response => {
                if (response.success) {
                    checkState();
                }
            }).then(wm.DataServices.provideOpenData).catch(handleException);
        });
    };

    let init = function () {
        dom.typeOfClothesPage = document.getElementById('type-of-clothes-page');
        dom.colorOfClothesPage = document.getElementById('color-of-clothes-page');
        dom.washingPage = document.getElementById('washing-page');

        dom.settings = document.getElementById('icon-settings');

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
