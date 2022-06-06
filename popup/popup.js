'use strict';

const {sendMessageToCurrentTab, sendGlobalMessage} = messagingUtils;

let sections = {
    search: document.getElementById("search"),
    result: document.getElementById("result"),
    options: document.getElementById("options"),
    history: document.getElementById("history"),
    actions: document.getElementById("actions"),
}

const optionsEntryPoint = document.getElementById("optionsEntryPoint")
const historyEntryPoint = document.getElementById("historyEntryPoint")
const searchEntryPoint = document.getElementById("searchEntryPoint")
const message = document.getElementById("message")

// find active tab and init popup
getActiveTabInfo(() => {
    initPopup();
})

function initPopup() {
    sendGlobalMessage({action: globalActions.POPUP_INIT}, (response) => {
        const {options = {}, history} = response
        if (!options.apiKey) {
            showSection(sections.options)
        } else {

            // set api key and type in utils
            apiUtils.setoptions(options.apiKey, options.apiType)
            sections.options["apiKey"].value = options.apiKey
            sections.options["apiType"].value = options.apiType
            sections.options["showFloatingButton"].checked = options.showFloatingButton
            sections.options["openMwWebsite"].checked = options.openMwWebsite

            // get selected text
            sendMessageToCurrentTab({action: globalActions.GET_SELECTED_TEXT}, (response = {}) => {
                if (response && response.selectedText) {
                    sections.search["trend"].value = response.selectedText
                    sections.search["trend"].select()
                    doSearch(response.selectedText)
                }
            });
        }
    })
}

sections.search.onsubmit = function (e) {
    e.preventDefault()

    const searchFor = e.target["trend"].value
    doSearch(searchFor)
}

sections.options.onsubmit = function (e) {
    e.preventDefault();

    const options = {
        apiKey: e.target["apiKey"].value || "",
        apiType: e.target["apiType"].value || "",
        showFloatingButton: e.target["showFloatingButton"].checked,
        openMwWebsite: e.target["openMwWebsite"].checked,
    }

    sendGlobalMessage({
        action: globalActions.SET_OPTIONS,
        options
    }, (res) => {
        if (res) {
            // update apiUtils options as well
            apiUtils.setoptions(options.apiKey, options.apiType)
            showSection(sections.search)
        }
    })
}

searchEntryPoint.onclick = () => showSection(sections.search)

optionsEntryPoint.onclick = () => showSection(sections.options)

historyEntryPoint.onclick = () => {
    storeUtils.loadHistory((history) => {
        showSection(sections.history)
        renderHistory(sortHistoryByDate(history), () => {
            sendGlobalMessage({action: globalActions.CLEAR_HISTORY}, () => {
                showSection(sections.search)
            })
        })
    })
}

function doSearch(searchTrend = null) {
    updateMessage("Fetching...")
    apiUtils.fetchData(searchTrend)
        .then((res) => {
            sendGlobalMessage({action: globalActions.ADD_TO_HISTORY, searchTrend})
            showSection(sections.result)
            renderUtils.renderResult(sections.result, res, searchTrend, doSearch)
        })
        .catch(e => {
            console.log(e.message);
            if (e.message.includes("Unexpected token K")) {
                updateMessage("API key missing, you need to put it in options first.")
            } else if (e.message.includes("No result")) {
                updateMessage(e.message)
            } else if (e.message.includes("Failed to fetch")) {
                updateMessage("It seems you are offline!")
            } else {
                updateMessage(`Unexpected error on data fetch! \n ` +
                    `Make sure your API key is valid and the API type you choose is the same as the one you chose when you registered.`)
            }
        })
}

function sortHistoryByDate(history) {
    if (!history) return null
    return Object.keys(history)
        .sort((a, b) => {
            return history[b].time - history[a].time
        })
        .map(item => [item, history[item].count])
}

function renderHistory(sortedHistory = [], onClearClick) {
    sections.history.innerHTML = ""
    showElement(sections.actions)

    const title = document.createElement("div")
    title.innerHTML = `<small>Your search history:</small>`
    sections.history.appendChild(title)

    if (!sortedHistory.length) {
        title.innerHTML = `<small>No history item yet!</small>`
        return
    }

    const list = document.createElement("ul")
    for (let [key, count] of sortedHistory) {
        const item = document.createElement("li")
        item.innerHTML = `<a href="#">${key}</a><span>${count > 1 ? ` (${count} times)` : ""}</span>`
        item.onclick = doSearch.bind(this, key)

        list.appendChild(item)
    }

    sections.history.appendChild(list)

    const clearBtn = document.createElement("button")
    clearBtn.setAttribute("class", "clear-history-btn")
    clearBtn.innerText = "Clear History"
    clearBtn.onclick = onClearClick
    sections.history.appendChild(clearBtn)
}

// hide all show the one
function showSection(section, hideAll = true) {
    if (!section) return

    if (hideAll) {
        for (let key in sections) {
            hideElement(sections[key])
        }
    }

    showElement(section)

    if (section === sections.search) {
        showElement(sections.actions)
        showElement(historyEntryPoint)
        showElement(optionsEntryPoint)
        hideElement(searchEntryPoint)
        sections.search["trend"].focus()
        updateMessage("")
    } else if (section === sections.history) {
        hideElement(historyEntryPoint)
        showElement(searchEntryPoint)
        showElement(optionsEntryPoint)
    } else if (section === sections.result) {
        showElement(sections.actions)
        showElement(searchEntryPoint)
    }
}

function showElement(section) {
    section.style.display = "block"
    if (section === sections.actions) {
        section.style.display = "flex"
    }
}

function hideElement(section) {
    section.style.display = "none"
}

function updateMessage(msg) {
    message.innerHTML = msg
}
