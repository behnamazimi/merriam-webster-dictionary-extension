'use strict';

try {
  importScripts("shared/constant.js", "shared/utils.js");
} catch (e) {
  console.log(e);
}

chrome.runtime.onMessage.addListener(handleMessages)

chrome.runtime.onInstalled.addListener(() => {
  // store initial options

  storeUtils.storeOptions(defaultOptions);
});

chrome.runtime.onConnect.addListener(function (port) {
  if (port.name === "popup") {
    port.onDisconnect.addListener(function () {
      messagingUtils.sendMessageToCurrentTab({action: globalActions.ON_POPUP_CLOSE})
    });
  }
});

function handleMessages(data, details, sendResponse) {
  switch (data.action) {
    case globalActions.INIT:
    case globalActions.POPUP_INIT:
      storeUtils.loadOptions((options) => {
        storeUtils.loadHistory((history) => {
          storeUtils.getPublicApiKeyUsage((publicApiUsage) => {
            sendResponse({options, history, publicApiUsage});
          })
        })
      })
      return true;
    case globalActions.SET_OPTIONS:
      storeUtils.loadOptions(prevOptions => {
        data.options = {...prevOptions, ...data.options}
        storeUtils.storeOptions(data.options, () => {
          messagingUtils.sendMessageToCurrentTab(data);
          sendResponse(true);
        });
      })
      return true;

    case globalActions.ADD_TO_HISTORY:
      storeUtils.addToHistory(data.searchTrend, () => {
        sendResponse(true);
      });
      return true;

    case globalActions.CLEAR_HISTORY:
      storeUtils.clearHistory(() => {
        sendResponse(true);
      });
      return true;

    case globalActions.GET_PUBLIC_API_USAGE:
      storeUtils.getPublicApiKeyUsage(sendResponse);
      return true;

    case globalActions.COUNT_UP_PUBLIC_API_USAGE:
      storeUtils.countUpPublicApiKeyUsage(sendResponse);
      return true;
  }

}
