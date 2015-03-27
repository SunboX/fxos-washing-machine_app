wm.WashingMachineApi = (function () {

    'use strict';

    let state = {
        IDLE: 'IDLE',
        COLLECTING_DATA: 'COLLECTING_DATA',
        READY: 'READY',
        RUNNING: 'RUNNING',
        FINISHED: 'FINISHED'
    };

    let loadType = {
        HEAVY: 'HEAVY',
        NORMAL: 'NORMAL',
        DELICATES: 'DELICATES',
        WOOL: 'WOOL'
    };

    let loadColor = {
        WHITE: 'WHITE',
        COLORED: 'COLORED',
        BLACK: 'BLACK'
    };
    
    let washingPowderType = {
        FULL: 'FULL',
        COLOR: 'COLOR'
    };

    let currentProgramUuid = null;

    let getUrl = function (url) {
        return new Promise(function (resolve, reject) {
            let req = new XMLHttpRequest({
                mozSystem: true
            });
            req.open('GET', url, true);
            req.onload = function () {
                if (req.status == 200) {
                    resolve(JSON.parse(req.response));
                } else {
                    reject(Error(req.statusText));
                }
            };
            req.onerror = function () {
                reject(Error('network error'));
            };
            req.send();
        });
    };

    let getProgramUuid = function () {
        let url = wm.URI.parse(wm.Config.washingMachineApi);
        url.parts.pathname = '/data/program-uuid';
        return getUrl(url.toString()).then(function (response) {
            currentProgramUuid = response.programUuid;
            return response;
        });
    };

    let getState = function () {
        console.log('getState');
        let url = wm.URI.parse(wm.Config.washingMachineApi);
        url.parts.pathname = '/data/state';
        console.log(url.toString());
        return getUrl(url.toString());
    };

    let setWaterHardness = function (programUuid, waterHardness) {
        // TODO: validate waterHardness
        let url = wm.URI.parse(wm.Config.washingMachineApi);
        url.parts.pathname = '/data/water-hardness';
        let query = {
            programUuid: programUuid,
            waterHardness: waterHardness
        };
        url.parts.query = wm.URI.serialize(query);
        return getUrl(url.toString());
    };
    
    let setWashingPowder = function (programUuid, washingPowder) {
        // TODO: validate washingPowder
        let url = wm.URI.parse(wm.Config.washingMachineApi);
        url.parts.pathname = '/data/washing-powder';
        let query = {
            programUuid: programUuid,
            washingPowder: washingPowder
        };
        url.parts.query = wm.URI.serialize(query);
        return getUrl(url.toString());
    };
    
    let setFabricConditioner = function (programUuid, fabricConditioner) {
        // TODO: validate washingPowder
        let url = wm.URI.parse(wm.Config.washingMachineApi);
        url.parts.pathname = '/data/fabric-conditioner';
        let query = {
            programUuid: programUuid,
            fabricConditioner: fabricConditioner
        };
        url.parts.query = wm.URI.serialize(query);
        return getUrl(url.toString());
    };

    let setLoadType = function (programUuid, type) {
        // TODO: validate type
        let url = wm.URI.parse(wm.Config.washingMachineApi);
        url.parts.pathname = '/data/type-of-load';
        let query = {
            programUuid: programUuid,
            type: type
        };
        url.parts.query = wm.URI.serialize(query);
        return getUrl(url.toString());
    };

    let setLoadColor = function (programUuid, color) {
        // TODO: validate color
        let url = wm.URI.parse(wm.Config.washingMachineApi);
        url.parts.pathname = '/data/color-of-load';
        let query = {
            programUuid: programUuid,
            color: color
        };
        url.parts.query = wm.URI.serialize(query);
        return getUrl(url.toString());
    };

    let start = function (programUuid) {
        let url = wm.URI.parse(wm.Config.washingMachineApi);
        url.parts.pathname = '/start';
        return getUrl(url.toString());
    };

    let stop = function (programUuid) {
        let url = wm.URI.parse(wm.Config.washingMachineApi);
        url.parts.pathname = '/stop';
        return getUrl(url.toString());
    };

    // public
    return {
        getProgramUuid: getProgramUuid,
        getState: getState,
        state: state,
        setWaterHardness: setWaterHardness,
        setWashingPowder: setWashingPowder,
        setFabricConditioner: setFabricConditioner,
        loadType: loadType,
        setLoadType: setLoadType,
        loadColor: loadColor,
        setLoadColor: setLoadColor,
        washingPowderType: washingPowderType,
        start: start,
        stop: stop
    };

})();
