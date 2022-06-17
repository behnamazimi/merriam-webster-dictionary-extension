'use strict';

const messagingUtils = (function () {

  function sendMessageToCurrentTab(body, responseCallback) {
    chrome.tabs.query({currentWindow: true, active: true}, (tabs) => {
      if (tabs && tabs[0])
        chrome.tabs.sendMessage(tabs[0].id, body, responseCallback);
    });
  }

  function sendGlobalMessage(body, cb) {
    chrome.runtime.sendMessage(body, cb);
  }

  return {
    sendMessageToCurrentTab,
    sendGlobalMessage,
  }
})();

const storeUtils = (function () {

  function storeOptions(data, cb) {
    chrome.storage.sync.set({"options": data}, function () {
      if (cb && typeof cb === "function") cb(data)
    });
  }

  function loadOptions(cb) {
    chrome.storage.sync.get("options", function (data) {
      if (cb && typeof cb === "function")
        cb(data.options)
    });
  }

  function loadHistory(cb) {
    chrome.storage.sync.get("history", function (data) {
      if (cb && typeof cb === "function")
        cb(data.history)
    });
  }

  function addToHistory(search, cb) {
    loadHistory((history = {}) => {

      // add if not exist
      if (!history[search]) {
        history[search] = {count: 0, time: Date.now()}
      }
      history[search].count++
      history[search].time = Date.now()

      chrome.storage.sync.set({history}, function () {
        if (cb && typeof cb === "function") cb(history)
      });
    })

  }

  function clearHistory(cb) {
    chrome.storage.sync.set({history: {}}, function () {
      if (cb && typeof cb === "function") cb()
    });
  }

  return {
    storeOptions,
    loadOptions,
    loadHistory,
    addToHistory,
    clearHistory,
  }
})();

const apiUtils = (function () {

  let API_KEY = "", API_TYPE = null;

  const setoptions = (key, type) => {
    API_KEY = key
    API_TYPE = type
  }

  const getApiEndpoint = (search, category, apiKey) => `https://www.dictionaryapi.com/api/v3/references/${category}/json/${search}?key=${apiKey}`

  function fetchData(search) {
    if (!search)
      return Promise.reject(new Error("Word is required!"))

    const endpoint = getApiEndpoint(search, API_TYPE, API_KEY)
    return new Promise((resolve, reject) => {
      fetch(endpoint)
        .then(response => response.json())
        .then((result) => {
          if (result.length) {
            resolve(parseResultData(result))
          } else {
            reject(new Error(`No result for "${search}"!`))
          }
        })
        .catch(reject)
    })
  }

  function parseResultData(rawData) {
    let parsedData = []

    if (typeof rawData[0] === "string") {
      return rawData
    }

    for (let res of rawData) {
      const id = res.meta.id
      const pron = res.hwi.prs?.[0].mw

      parsedData.push({
        id,
        type: res.fl,
        shortDef: res.shortdef,
        synonyms: res.meta.syns?.[0],
        pron,
        sound: generateSoundSrc(res),
        examples: getExamples(res),
      })
    }

    return parsedData
  }

  function generateSoundSrc(res) {
    // if audio begins with "bix", the subdirectory should be "bix",
    // if audio begins with "gg", the subdirectory should be "gg",
    // if audio begins with a number or punctuation (eg, "_"), the subdirectory should be "number",
    // otherwise, the subdirectory is equal to the first letter of audio.
    const pron = res.hwi.prs?.[0]
    const audio = pron?.sound?.audio
    let audioSubDir = ""
    let subDirRegEx = /^(bix|gg|[a-zA-Z]|\d+)(.*)$/g
    if (audio && audio.matchAll(subDirRegEx)) {
      const matchRes = audio.matchAll(subDirRegEx)
      audioSubDir = [...matchRes][0]?.[1]
      if (!isNaN(audioSubDir)) {
        audioSubDir = "number"
      }
    }
    return pron?.sound ? `https://media.merriam-webster.com/audio/prons/en/us/mp3/${audioSubDir}/${audio}.mp3` : null
  }

  function getExamples(res) {
    const expRegex = /"t":"([^"]*)"/gm
    const matches = JSON.stringify(res).matchAll(expRegex)
    let examples = []
    if (matches) {
      for (let [, t] of matches) {
        examples.push(t)
      }
    }
    return examples
  }

  return {
    setoptions,
    fetchData,
  }
})();

const renderUtils = (function () {

  function renderResult(target, result, searchedFor = null, handleTrendSearch) {
    target.innerHTML = ""

    // render suggestions
    if (!result.length || typeof result[0] === "string") {
      const title = document.createElement("div")
      title.innerHTML = `<small>No result found! <br/>Here are the similar ones to what you're looking for:</small>`
      target.appendChild(title)

      // render suggestion list if exists
      const list = document.createElement("ul")
      for (let item of result) {
        const i = document.createElement("li")
        i.innerHTML = `<a href="#">${item}</a>`
        i.onclick = handleTrendSearch.bind(this, item)
        list.appendChild(i)
      }

      target.appendChild(list)
      return
    }

    // link to webster's page
    if (searchedFor) {
      const link = document.createElement("a")
      link.setAttribute("class", "link-to-mw")
      link.target = "_blank"
      link.href = `https://www.merriam-webster.com/dictionary/${searchedFor}`
      link.innerText = "Open in Merriam-Webster"
      target.appendChild(link)
    }

    // render defs
    for (let item of result) {
      if (!item.shortDef) continue;

      const details = document.createElement("details")
      details.open = true
      const [id, counter] = item.id.split(":")
      details.innerHTML = `<summary><span>${(counter ? counter + ": " : "")}</span><strong>${id} <small>${item.type || ""}</small></strong></summary>`
      target.appendChild(details)

      const content = document.createElement("div")
      content.setAttribute("class", "item-content")
      details.appendChild(content)

      if (item.pron) {
        let pronMeta = document.createElement("span")
        pronMeta.setAttribute("class", "pron")
        pronMeta.innerHTML = `\\${item.pron}\\ ${item.sound ? `<img src="${playIcon}" alt="">` : ''}`
        pronMeta.onclick = () => new Audio(item.sound).play()
        content.appendChild(pronMeta)
      }

      if (item.synonyms) {
        const syns = document.createElement("p")
        syns.setAttribute("class", "syns")
        syns.innerHTML = "synonym: " + item.synonyms.join(", ")
        details.appendChild(syns)
      }

      const defs = document.createElement("ul")
      for (let d of item.shortDef) {
        const de = document.createElement("li")
        de.innerHTML = d
        defs.append(de)
      }
      content.appendChild(defs)

      if (item.examples) {
        const eg = document.createElement("p")
        eg.setAttribute("class", "examples")
        eg.innerHTML = ""
        for (let example of item.examples) {
          const itemSpan = document.createElement("span")
          itemSpan.innerHTML = ">> " + example
            .replace("{it}", "<strong>").replace("{/it}", "</strong>")
            .replace("{wi}", "<strong>").replace("{/wi}", "</strong>")
          eg.append(itemSpan)
        }
        details.appendChild(eg)
      }

    }
  }

  function createFloatingButton() {
    const button = document.createElement("button")
    button.innerHTML = searchIcon
    button.setAttribute("id", "mw-dic-btn")
    return button
  }

  function renderBubble(result, searchedFor) {
    const selectionRect = window.getSelection().getRangeAt(0).getBoundingClientRect()

    let bubble = document.getElementById("mw-dic")
    if (!bubble) {
      bubble = document.createElement("div")
      bubble.setAttribute("id", "mw-dic")
      bubble.setAttribute("class", "bubble")
      document.body.appendChild(bubble)
    }

    renderUtils.renderResult(bubble, result, searchedFor, doSearch)

    let clientLeft = (selectionRect.left + (selectionRect.width / 2)) - (bubble.clientWidth / 2)
    let clientTop = selectionRect.top - bubble.clientHeight

    if (clientTop < 0) {
      clientTop = selectionRect.top + selectionRect.height
    }
    if (clientLeft < 0) {
      clientLeft = selectionRect.left
    }

    if (clientLeft + bubble.clientWidth >= window.innerWidth) {
      clientLeft = selectionRect.left - bubble.clientWidth + selectionRect.width
    }

    const left = clientLeft + window.scrollX
    const top = clientTop + window.scrollY

    bubble.style.top = top + "px"
    bubble.style.left = left + "px"
    return bubble
  }

  return {
    renderResult,
    createFloatingButton,
    renderBubble
  }
})();


function getActiveTabInfo(cb) {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    const activeTab = tabs ? tabs[0] : {};
    cb && typeof cb === "function" && cb(activeTab)
  });
}

