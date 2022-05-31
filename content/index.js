'use strict';

const icon = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 48 48" enable-background="new 0 0 48 48" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><g fill="#616161"><rect x="34.6" y="28.1" transform="matrix(.707 -.707 .707 .707 -15.154 36.586)" width="4" height="17"></rect><circle cx="20" cy="20" r="16"></circle></g><rect x="36.2" y="32.1" transform="matrix(.707 -.707 .707 .707 -15.839 38.239)" fill="#37474F" width="4" height="12.3"></rect><circle fill="#64B5F6" cx="20" cy="20" r="13"></circle><path fill="#BBDEFB" d="M26.9,14.2c-1.7-2-4.2-3.2-6.9-3.2s-5.2,1.2-6.9,3.2c-0.4,0.4-0.3,1.1,0.1,1.4c0.4,0.4,1.1,0.3,1.4-0.1 C16,13.9,17.9,13,20,13s4,0.9,5.4,2.5c0.2,0.2,0.5,0.4,0.8,0.4c0.2,0,0.5-0.1,0.6-0.2C27.2,15.3,27.2,14.6,26.9,14.2z"></path></svg>`;
let isApiOptionsReady = false
let floatingButton = null
let bubble = null

chrome.runtime.onMessage.addListener(handleMessages)
window.addEventListener("DOMContentLoaded", init)
window.addEventListener("mouseup", handleMouseUp)

function init() {
    messagingUtils.sendGlobalMessage({action: globalActions.INIT}, (response) => {
        const {options = {}, history} = response

        // set api key and type in utils
        apiUtils.setApiOptions(options.apiKey, options.apiType)
        isApiOptionsReady = true
    })
}

function handleMessages(request, sender, sendResponse) {
    if (request.action === globalActions.GET_SELECTED_TEXT && !bubble) {
        const selectedText = window.getSelection().toString()
        sendResponse({selectedText})
    } else if (request.action === globalActions.SET_OPTIONS) {
        // set api key and type in utils
        apiUtils.setApiOptions(request.options.apiKey, request.options.apiType)
        isApiOptionsReady = true;
    }
}

function handleMouseUp(event) {
    if (!isApiOptionsReady) {
        return
    }

    if (floatingButton && floatingButton.contains(event.target)) {
        hideFloatingButton()
        doSearch()
        return true
    }

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