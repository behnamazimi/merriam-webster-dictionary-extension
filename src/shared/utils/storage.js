import {defaultOptions} from "./constants";

export function storeOptions(data, cb) {
  chrome.storage.sync.set({options: data}, function () {
    if (cb && typeof cb === "function") cb(data)
  });
}

export function loadOptions(cb) {
  chrome.storage.sync.get("options", function (data) {
    if (cb && typeof cb === "function")
      cb(data.options || defaultOptions)
  });
}

export function loadHistory(cb) {
  chrome.storage.local.get("history", function (data) {
    if (cb && typeof cb === "function")
      cb(data.history)
  });
}

export function addToHistory(search, cb) {
  loadHistory((history = {}) => {

    // add if not exist
    if (!history[search]) {
      history[search] = {count: 0, time: Date.now()}
    }
    history[search].count++
    history[search].time = Date.now()

    chrome.storage.local.set({history}, function () {
      if (cb && typeof cb === "function") cb(history)
    });
  })

}

export function clearHistory(cb) {
  chrome.storage.local.set({history: {}}, function () {
    if (cb && typeof cb === "function") cb()
  });
}

export function getPublicApiKeyUsage(cb) {
  chrome.storage.sync.get("publicApiUsage", function (data) {
    if (cb && typeof cb === "function")
      cb(data.publicApiUsage || 0)
  });
}

export function countUpPublicApiKeyUsage(cb) {
  getPublicApiKeyUsage((prevCount = 0) => {
    const publicApiUsage = prevCount + 1
    chrome.storage.sync.set({publicApiUsage}, function () {
      if (cb && typeof cb === "function") cb(publicApiUsage)
    });
  })
}
