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
            dom.connectingPage.hidden = true;
            break;

        case pages.LOAD_TYPE:
            dom.connectingPage.hidden = true;
            dom.typeOfClothesPage.hidden = false;
            dom.colorOfClothesPage.hidden = true;
            dom.startPage.hidden = true;
            dom.washingPage.hidden = true;
            break;

        case pages.LOAD_COLOR:
            dom.connectingPage.hidden = true;
            dom.typeOfClothesPage.hidden = true;
            dom.colorOfClothesPage.hidden = false;
            dom.startPage.hidden = true;
            dom.washingPage.hidden = true;
            break;

        case pages.START:
            dom.connectingPage.hidden = true;
            dom.typeOfClothesPage.hidden = true;
            dom.colorOfClothesPage.hidden = true;
            dom.startPage.hidden = false;
            dom.washingPage.hidden = true;
            break;

        case pages.WASHING:
            dom.connectingPage.hidden = true;
            dom.typeOfClothesPage.hidden = true;
            dom.colorOfClothesPage.hidden = true;
            dom.startPage.hidden = true;
            dom.washingPage.hidden = false;
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
            case wm.WashingMachineApi.state.READY:
                showPage(pages.START);
                break;
            }
        });
    };

    let attachEvents = function () {
        let settingButtons = document.querySelectorAll('.icon-settings');
        for (let i = 0, len = settingButtons.length; i < len; i++) {
            settingButtons[i].addEventListener('click', function () {
                location.reload();
            });
        }

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

        // Start
        document.getElementById('start-button').addEventListener('click', function () {
            showPage(pages.WASHING);
            wm.WashingMachineApi.start(programUuid).then(response => {
                if (response.success) {
                    let minutesLeft = 120;
                    let updateTimeLeft = function(){
                        dom.durationCircle.style.strokeDashoffset = (dom.durationCircle.style.strokeDasharray / 120) * minutesLeft;
                        dom.durationHoursLeft.textContent = Math.floor(minutesLeft / 60);
                        let minutes = minutesLeft - Math.floor(minutesLeft / 60) * 60;
                        dom.durationMinutesLeft.textContent = minutes < 10 ? '0' + minutes : minutes;
                        minutesLeft--;
                    };

                    let timerInterval = setInterval(() => {
                        if (minutesLeft > 0) {
                            updateTimeLeft();
                        } else {
                            clearInterval(timerInterval);
                            dom.durationHoursLeft.textContent = 0;
                            dom.durationMinutesLeft.textContent = 0;
                        }
                    }, 60000);
                    updateTimeLeft();
                }
            }).catch(handleException);
        });

        let stopButtons = document.querySelectorAll('.icon-stop');
        for (let i = 0, len = stopButtons.length; i < len; i++) {
            stopButtons[i].addEventListener('click', function () {
                wm.WashingMachineApi.stop().then(response => {
                    if (response.success) {
                        checkState();
                    }
                }).then(wm.DataServices.provideOpenData).catch(handleException);
            });
        }
    };

    let init = function () {
        dom.connectingPage = document.getElementById('connecting-page');
        dom.typeOfClothesPage = document.getElementById('type-of-clothes-page');
        dom.colorOfClothesPage = document.getElementById('color-of-clothes-page');
        dom.startPage = document.getElementById('start-page');
        dom.washingPage = document.getElementById('washing-page');
        dom.durationCircle = document.getElementById('duration-circle');
        dom.durationHoursLeft = document.getElementById('duration-hours-left');
        dom.durationMinutesLeft = document.getElementById('duration-minutes-left');

        dom.durationCircle.style.strokeDasharray = Math.PI * parseInt(dom.durationCircle.getAttribute('r'), 10) * 2;

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
