'use strict';

try {
    importScripts("shared/constant.js", "shared/utils.js");
} catch (e) {
    console.log(e);
}

chrome.runtime.onMessage.addListener(handleMessages)

chrome.runtime.onInstalled.addListener(() => {
    // store initial options

    //Key (Collegiate Dictionary): collegiate
    // bc18d6bb-182e-4f34-b57d-da52bdfdfbc2
    //
    // Key (Intermediate Dictionary): sd3
    // 6b3a80cc-9d9f-4007-9ee5-52a24ab7eb31

    storeUtils.storeOptions({apiKey: "6b3a80cc-9d9f-4007-9ee5-52a24ab7eb31", apiType: "sd3", showFloatingButton: true});
});

function handleMessages(data, details, sendResponse) {
    switch (data.action) {
        case globalActions.INIT:
        case globalActions.POPUP_INIT:
            storeUtils.loadOptions((options) => {
                storeUtils.loadHistory((history) => {
                    sendResponse({options, history});
                })
            })
            return true;
        case globalActions.SET_OPTIONS:
            storeUtils.storeOptions(data.options);
            messagingUtils.sendMessageToCurrentTab(data);
            sendResponse(true);
            return true;

        case globalActions.ADD_TO_HISTORY:
            storeUtils.addToHistory(data.searchTrend);
            sendResponse(true);
            return true;

        case globalActions.CLEAR_HISTORY:
            storeUtils.clearHistory(() => {
                sendResponse(true);
            });
            return true;
    }

}
