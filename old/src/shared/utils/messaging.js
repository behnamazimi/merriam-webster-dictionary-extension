export function sendMessageToCurrentTab(body, responseCallback) {
  chrome.tabs.query({currentWindow: true, active: true}, (tabs) => {
    if (tabs && tabs[0])
      chrome.tabs.sendMessage(tabs[0].id, body, responseCallback);
  });
}

export function sendGlobalMessage(body, cb) {
  chrome.runtime.sendMessage(body, cb);
}