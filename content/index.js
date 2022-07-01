'use strict';

let isReady = false
let showFloatingButton = false
let openMwWebsite = false
let floatingButton = null
let pauseVideoOnPopupOpen = null
let bubble = null
let lastPlayingVideo = null

chrome.runtime.onMessage.addListener(handleMessages)
window.addEventListener("DOMContentLoaded", init)
window.addEventListener("mouseup", handleMouseUp)

function init() {
  messagingUtils.sendGlobalMessage({action: globalActions.INIT}, (response) => {
    const {options = {}, history} = response

    // set api key and type in utils
    apiUtils.setOptions(options.apiKey, options.apiType)
    showFloatingButton = options.showFloatingButton
    openMwWebsite = options.openMwWebsite
    pauseVideoOnPopupOpen = options.pauseVideoOnPopupOpen
    isReady = true
  })
}

function handleMessages(request, sender, sendResponse) {
  if (request.action === globalActions.LINK_TO_POPUP && !bubble) {
    // find playing video and pause it
    if (!lastPlayingVideo && pauseVideoOnPopupOpen) {
      document.querySelectorAll("video").forEach((video) => {
        if (video.duration > 1 && !video.paused) {
          lastPlayingVideo = video;
          video.pause()
        }
      })
    }

    const selectedText = window.getSelection().toString()
    sendResponse({selectedText})

  } else if (request.action === globalActions.ON_POPUP_CLOSE && lastPlayingVideo) {
    lastPlayingVideo.play()
    lastPlayingVideo = null

  } else if (request.action === globalActions.SET_OPTIONS) {
    // set api key and type in utils
    apiUtils.setOptions(request.options.apiKey, request.options.apiType)
    showFloatingButton = request.options.showFloatingButton
    openMwWebsite = request.options.openMwWebsite
    pauseVideoOnPopupOpen = request.options.pauseVideoOnPopupOpen
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
    handleFloatingButtonClick()
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

function handleFloatingButtonClick() {
  const searchTrend = window.getSelection().toString()
  if (!searchTrend || searchTrend === "\n") {
    return
  }

  if (openMwWebsite) {
    window.open(`https://www.merriam-webster.com/dictionary/${searchTrend}`)
  } else {
    doSearch(searchTrend)
  }
}

function doSearch(searchTrend = "") {

  apiUtils.fetchData(searchTrend)
    .then((result) => {
      messagingUtils.sendGlobalMessage({action: globalActions.ADD_TO_HISTORY, searchTrend})
      bubble = renderUtils.renderBubble(result, searchTrend)
    })
    .catch(e => {
      console.log(e.message)
      if (e.message.includes("No result") || e.message.includes("Word is required")) {
        // console.log(e.message)
      } else if (e.message.includes("Failed to fetch")) {
        bubble = renderUtils.showMessageOnBubble(messages.offline)
      } else if (e.message === "PERSONAL_KEY_NEEDED") {
        bubble = renderUtils.showMessageOnBubble(messages.publicOptionsLimitReached)
      } else {
        bubble = renderUtils.showMessageOnBubble(messages.unexpectedError)
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