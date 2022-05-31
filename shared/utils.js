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

            chrome.storage.sync.set({history}, function () {
                if (cb && typeof cb === "function") cb(history)
            });
        })

    }

    return {
        storeOptions,
        loadOptions,
        loadHistory,
        addToHistory,
    }
})();

const apiUtils = (function () {

    let API_KEY = "", API_TYPE = null;

    const setoptions = (key, type) => {
        console.log(key, type);
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
                synonyms: res.syns?.[0]?.["pt"][0][1],
                pron,
                sound: generateSoundSrc(res),
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

            let pronMeta = document.createElement("span")
            pronMeta.setAttribute("class", "pron")
            if (item.pron) {
                pronMeta.innerHTML = `\\${item.pron}\\ <img src="${playIcon}" alt="">`
                pronMeta.onclick = () => new Audio(item.sound).play()
            }

            const details = document.createElement("details")
            details.open = true
            const [id, counter] = item.id.split(":")
            details.innerHTML = `<summary><span>${(counter ? counter + ": " : "")}</span><strong>${id} <small>${item.type || ""}</small></strong></summary>`

            const def = document.createElement("p")
            def.appendChild(pronMeta)
            def.append(item.shortDef)

            details.appendChild(def)
            target.appendChild(details)
        }
    }

    function createFloatingButton() {
        const button = document.createElement("button")
        button.innerHTML = `${icon}`
        button.setAttribute("id", "mw-dic-btn")
        return button
    }

    function renderBubble(result, searchedFor) {
        const selectionRect = window.getSelection().getRangeAt(0).getBoundingClientRect()

        let bubble = document.getElementById("mw-dic-bubble")
        if (!bubble) {
            bubble = document.createElement("div")
            bubble.setAttribute("id", "mw-dic-bubble")
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

