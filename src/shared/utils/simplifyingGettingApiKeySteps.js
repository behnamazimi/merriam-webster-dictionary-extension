// to make it simple for users to get the key fast and easy
import {API_TYPES, globalActions} from "./constants";
import {sendGlobalMessage} from "./messaging";

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

  async function setKeyOnBtnClick(apiType, apiKey, event) {
    await sendGlobalMessage({
      action: globalActions.SET_OPTIONS, data: {
        apiKey, apiType,
      }
    })
    event.target.innerText = "Done!"
  }
}

export default simplifyingGettingApiKeySteps