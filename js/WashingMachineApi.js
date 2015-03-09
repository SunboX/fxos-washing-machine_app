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

    let currentProgramUuid = null;

    let getUrl = function (url) {
        return new Promise(function (resolve, reject) {
            var req = new XMLHttpRequest();
            req.open('GET', url, true);
            req.onload = function () {
                if (req.status == 200) {
                    resolve(JSON.parse(req.response);)
                } else {
                    reject(Error(req.statusText));
                }
            };
            req.onerror = function () {
                reject(Error('network error'));
            };
            req.send();
        });
    }

    let getProgramUuid = function () {
        let url = wm.URI.parse(wm.Config.washingMachineApi);
        url.pathname = '/info/program-uuid';
        return getUrl(url.toString()).then(function(response) {
            currentProgramUuid = response.programUuid;
        };
    };

    let getState = function () {
        let url = wm.URI.parse(wm.Config.washingMachineApi);
        url.pathname = '/info/state';
        return getUrl(url.toString());
    };

    let setLoadType = function (type) {
        // TODO: validate type
        let url = wm.URI.parse(wm.Config.washingMachineApi);
        url.pathname = '/info/type-of-load';
        let query = {
            type: type
        };
        url.parts.query = wm.URI.serialize(query);
        return getUrl(url.toString());
    };

    // public
    return {
        getProgramUuid: getProgramUuid,
        getState: getState,
        state: state,
        loadType: loadType,
        setLoadType: setLoadType
    };

})();
