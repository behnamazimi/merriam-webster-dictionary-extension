import {services} from "../shared/utils/services";
import {API_TYPES, globalActions, searchIcon} from "../shared/utils/constants";
import {sendGlobalMessage} from "../shared/utils/messaging";
import ReactDOM from "react-dom/client";
import Bubble from "./Bubble";
import "./content.scss";

let options = null
const pageSettings = {
  isReady: false,
  lastPlayingVideo: null,
  bubble: null,
}

window.addEventListener("DOMContentLoaded", init)
window.addEventListener("mouseup", handleMouseUp)
chrome.runtime.onMessage.addListener(handleMessages)

function init() {
  sendGlobalMessage({action: globalActions.INIT}, (response) => {
    // set api key and type in utils
    services.setAuth(response.options.apiKey, response.options.apiType)
    options = response.options
    pageSettings.isReady = true
  })

  // manipulate dictionaryapi website to make it easy to get API keys
  simplifyingGettingApiKeySteps();
}

function handleMouseUp(event) {
  setTimeout(() => {

    if (!pageSettings.isReady) {
      return
    }

    const selection = window.getSelection()

    // hide bubble if it's open and click is out of it
    if (pageSettings.bubble && !pageSettings.bubble.contains(event?.target)) {
      pageSettings.bubble.remove()
      pageSettings.bubble = null
    }

    if (options.wordSelectMode === "OPEN_IMMEDIATELY") {
      hideFloatingButton()
      handleImmediateResultOpen()

    } else if (options.wordSelectMode === "OPEN_WITH_BUTTON" || options.wordSelectMode === "OPEN_ON_WEBSITE") {

      // when floating search button clicked
      if (pageSettings.floatingButton && pageSettings.floatingButton.contains(event.target)) {
        hideFloatingButton()
        const searchTrend = selection.toString()
        if (!searchTrend || searchTrend === "\n") {
          return
        }

        if (options.wordSelectMode === "OPEN_ON_WEBSITE") {
          window.open(`https://www.merriam-webster.com/dictionary/${searchTrend}`)
        } else {
          handleImmediateResultOpen()
        }
        return true
      }

      // hide button after potential existence
      hideFloatingButton()

      const selectedText = selection.toString()
      if (!selectedText || selectedText === "\n") {
        return true
      }

      pageSettings.floatingButton = generateFloatingButton(event)
    }

  }, 10)
}

function handleMessages(request, sender, sendResponse) {
  if (request.action === globalActions.LINK_TO_POPUP && !pageSettings.bubble) {
    // find playing video and pause it
    if (!pageSettings.lastPlayingVideo && options.pauseVideoOnPopupOpen) {
      document.querySelectorAll("video").forEach((video) => {
        if (video.duration > 1 && !video.paused) {
          pageSettings.lastPlayingVideo = video;
          video.pause()
        }
      })
    }

    const selectedText = window.getSelection().toString()
    sendResponse({selectedText})

  } else if (request.action === globalActions.ON_POPUP_CLOSE && pageSettings.lastPlayingVideo) {
    pageSettings.lastPlayingVideo.play()
    pageSettings.lastPlayingVideo = null

  } else if (request.action === globalActions.SET_OPTIONS) {
    // set api key and type in utils
    services.setAuth(request.options.apiKey, request.options.apiType)
    options = request.options
    pageSettings.isReady = true
  }
  return true
}

function hideFloatingButton() {
  if (pageSettings.floatingButton) {
    pageSettings.floatingButton.remove()
    pageSettings.floatingButton = null
  }
}

function handleImmediateResultOpen() {
  const searchTrend = window.getSelection().toString()
  if (!searchTrend || searchTrend === "\n") {
    return
  }

  const host = pageSettings.bubble = generateHost(searchTrend)
  const bubbleApp = ReactDOM.createRoot(host.shadowRoot)
  bubbleApp.render(<Bubble searchFor={searchTrend.trim()}/>)
}

function generateHost() {

  // remove prev host if exists
  document.getElementById("mw-dic")?.remove()

  const host = document.createElement("div")
  host.setAttribute("id", "mw-dic")
  host.setAttribute("class", "button")
  document.body.insertBefore(host, document.body.firstChild)
  host.attachShadow({mode: 'open'});

  setTimeout(() => {
    const selectionRect = window.getSelection().getRangeAt(0).getBoundingClientRect()
    let clientLeft = (selectionRect.left + (selectionRect.width / 2)) - (host.clientWidth / 2)
    let clientTop = selectionRect.top - host.clientHeight

    if (clientTop < 0) {
      clientTop = selectionRect.top + selectionRect.height
    }
    if (clientLeft < 0) {
      clientLeft = selectionRect.left
    }

    if (clientLeft + host.clientWidth >= window.innerWidth) {
      clientLeft = selectionRect.left - host.clientWidth + selectionRect.width
    }

    const left = clientLeft + window.scrollX
    const top = clientTop + window.scrollY

    host.style.top = top + "px"
    host.style.left = left + "px"
  }, 10)

  return host
}

function generateFloatingButton(event) {
  const selection = window.getSelection();

  const button = document.createElement("button")
  button.innerHTML = searchIcon
  button.setAttribute("id", "mw-dic-btn")
  document.body.insertBefore(button, document.body.firstChild)
  const selectionRect = selection.getRangeAt(0).getBoundingClientRect()
  const buttonHeight = 28
  let top = selectionRect.top + window.scrollY - buttonHeight
  let left = event.pageX - (button.clientWidth / 2)

  if (event.clientY >= selectionRect.top + (selectionRect.height / 2)) {
    top = window.scrollY + selectionRect.top + selectionRect.height + 6
  }

  button.style.display = "inline-flex"
  button.style.left = left + "px"
  button.style.top = top + "px"
  return button
}

// to make it simple for users to get the key fast and easy
function simplifyingGettingApiKeySteps() {
  // only if it's dictionaryapi's website
  if (window.location.host !== "dictionaryapi.com") {
    return;
  }

  makeRegistrationFormSimpler()
  helpToCopyExistedKeys()

  function makeRegistrationFormSimpler() {
    if (window.location.href !== "https://dictionaryapi.com/register/index") {
      return
    }

    const registerForm = document.getElementById("register-form")
    if (!registerForm) {
      return
    }

    let button = generateSimplifyingButton()
    button.onclick = () => {
      fillRegistrationForm()
      button.remove()
      button = null
    }


    function generateSimplifyingButton() {
      const button = document.createElement("button")
      button.classList.add("mw-dic-sim-btn")
      button.innerHTML = `<div><div>Click here to make registration simpler</div><small>by filling some fields with ready-made texts</small></div>`
      document.body.appendChild(button)
      return button
    }

    function fillRegistrationForm() {
      registerForm.user_estimate.value = 1
      registerForm.user_estimate.closest(".row").style.display = "none"

      registerForm.role.value = "Final User"
      registerForm.role.closest(".row").style.display = "none"

      registerForm.company_name.value = "Personal Use"
      registerForm.company_name.closest(".row").style.display = "none"

      registerForm.app_name.value = "MW's dic chrome extension"
      registerForm.app_name.closest(".row").style.display = "none"

      registerForm.app_desc.value = "Merriam-Webster' dictionary extension for Chrome and any chromium based browser"
      registerForm.app_desc.closest(".row").style.display = "none"

      registerForm.app_url.value = "https://chrome.google.com/webstore/detail/gmhgdiamihghcepkeapfoeakphffcdkk"
      registerForm.app_url.closest(".row").style.display = "none"

      registerForm.app_launch_date.value = "06/01/2022"
      registerForm.app_launch_date.closest(".row").style.display = "none"

    }
  }

  function helpToCopyExistedKeys() {
    if (window.location.href !== "https://dictionaryapi.com/account/my-keys") {
      return
    }

    document.querySelectorAll(".key-links")
      .forEach(apiKeyElm => {
        const lbl = apiKeyElm.parentElement.previousElementSibling
        if (lbl) {
          const apiTypeName = lbl.textContent.replace(/.*\(/, "").replace(/\).*/, "")
          const apiType = API_TYPES[apiTypeName];
          if (apiType) {
            addHelpersToUseKey(apiKeyElm, apiType, apiKeyElm.textContent)
          }
        }
      })

  }

  function addHelpersToUseKey(apiKeyElm, apiType, apiKey) {
    const button = document.createElement("button")
    button.innerText = "Use this key"
    apiKeyElm.after(button)
    button.onclick = setKeyOnBtnClick.bind(this, apiType, apiKey)
  }

  function setKeyOnBtnClick(apiType, apiKey, event) {
    sendGlobalMessage({
      action: globalActions.SET_OPTIONS,
      options: {
        apiKey,
        apiType,
      }
    }, () => {
      event.target.innerText = "Done!"
    })
  }
}