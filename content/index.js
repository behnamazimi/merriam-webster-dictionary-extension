'use strict';

let isReady = false
let showFloatingButton = false
let floatingButton = null
let bubble = null

chrome.runtime.onMessage.addListener(handleMessages)
window.addEventListener("DOMContentLoaded", init)
window.addEventListener("mouseup", handleMouseUp)

function init() {
    messagingUtils.sendGlobalMessage({action: globalActions.INIT}, (response) => {
        const {options = {}, history} = response

        // set api key and type in utils
        apiUtils.setoptions(options.apiKey, options.apiType)
        showFloatingButton = options.showFloatingButton
        isReady = true
    })
}

function handleMessages(request, sender, sendResponse) {
    if (request.action === globalActions.GET_SELECTED_TEXT && !bubble) {
        const selectedText = window.getSelection().toString()
        sendResponse({selectedText})
    } else if (request.action === globalActions.SET_OPTIONS) {
        // set api key and type in utils
        apiUtils.setoptions(request.options.apiKey, request.options.apiType)
        showFloatingButton = request.options.showFloatingButton
        isReady = true;
    }
}

function handleMouseUp(event) {
    if (!isReady) {
        return
    }

    if (!showFloatingButton) {
        hideFloatingButton()
        return
    }

    // when floating search button clicked
    if (floatingButton && floatingButton.contains(event.target)) {
        hideFloatingButton()
        doSearch()
        return true
    }

    // close bubble if click is out of it
    if (bubble && !bubble.contains(event.target)) {
        hideBubble()
    }

    hideFloatingButton()

    const selection = window.getSelection()
    const selectedText = selection.toString()
    if (!selectedText || selectedText === "\n") {
        return true
    }

    floatingButton = renderUtils.createFloatingButton()
    document.body.appendChild(floatingButton)

    const selectionRect = selection.getRangeAt(0).getBoundingClientRect()

    const buttonHeight = 28
    let top = selectionRect.top + window.scrollY - buttonHeight
    let left = event.pageX - (floatingButton.clientWidth / 2)

    if (event.clientY >= selectionRect.top + (selectionRect.height / 2)) {
        top = window.scrollY + selectionRect.top + selectionRect.height + 6
    }

    floatingButton.style.display = "inline-flex"
    floatingButton.style.left = left + "px"
    floatingButton.style.top = top + "px"

}

function doSearch(forcedTextToSearch = null) {
    const searchTrend = forcedTextToSearch || window.getSelection().toString()

    apiUtils.fetchData(searchTrend)
        .then((result) => {
            messagingUtils.sendGlobalMessage({action: globalActions.ADD_TO_HISTORY, searchTrend})
            bubble = renderUtils.renderBubble(result, searchTrend)
        })
        .catch(e => {
            console.log(e.message)
            if (e.message.includes("No result") ||
                e.message.includes("Word is required")) {
                console.log(e.message)
            } else if (e.message.includes("Failed to fetch")) {
                console.log("It seems you are offline!")
            } else {
                console.log(`Unexpected error on data fetch! \n ` +
                    `Make sure your API key is valid and the API type you choose is the same as the one you chose when you registered.`)
            }
        })
}

function hideFloatingButton() {
    if (floatingButton) {
        floatingButton.remove()
        floatingButton = null
    }
}

function hideBubble() {
    if (bubble) {
        bubble.remove()
        bubble = null
    }
}