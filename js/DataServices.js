wm.DataServices = (function () {

    'use strict';

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

    let getGeoLocation = function (url) {
        return new Promise(navigator.geolocation.getCurrentPosition.bind(navigator.geolocation));
    };

    let fetchWaterHardness = function () {
        return getGeoLocation().then(position => {
            let url = wm.URI.parse(wm.Config.waterApiUrl);
            let query = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            };
            url.parts.query = wm.URI.serialize(query);
            return getUrl(url.toString());
        });
    };

/*

https://etherpad.mozilla.org/yhltaFmC1r

*/

    let provideOpenData = function () {
        return Promise.all([
            wm.DataServices.fetchWaterHardness(),
            wm.WashingMachineApi.getProgramUuid()
        ]).then(responses => {

            let [waterResponse, programUuidResponse] = responses;

            console.log(waterResponse);
            console.log(programUuidResponse);

            return Promise.all([
                wm.WashingMachineApi.setWaterHardness(programUuidResponse.programUuid, waterResponse.water.hardness),
                wm.WashingMachineApi.setWashingPowder(programUuidResponse.programUuid, {
                    type: wm.WashingMachineApi.washingPowderType.FULL,
                    dosis: 20 // TODO: fetch from WebService - in ml per 1 kg of "laundry"
                }),
                wm.WashingMachineApi.setFabricConditioner(programUuidResponse.programUuid, {
                    dosis: 4 // TODO: fetch from WebService - in ml per 1 kg of "laundry"
                })
            ]);

        }).catch(ex => {
            console.log(ex);
        });
    };

    // public
    return {
        fetchWaterHardness: fetchWaterHardness,
        provideOpenData: provideOpenData
    };

})();
