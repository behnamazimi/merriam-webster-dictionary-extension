'use strict';

try {
    importScripts("shared/constant.js", "shared/utils.js");
} catch (e) {
    console.log(e);
}

chrome.runtime.onMessage.addListener(handleMessages)

chrome.runtime.onInstalled.addListener(() => {
    // store initial options
    storeUtils.storeOptions({apiKey: "bc18d6bb-182e-4f34-b57d-da52bdfdfbc2", apiType: "collegiate"});
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

        case globalActions.OPEN_POPUP:
            sendResponse(true);
            return true;
    }

}
