import { API_TYPES } from "../constants/constants";
import { sendGlobalMessage } from "./messaging";
import { GlobalActionTypes, OptionsType } from "../types";

// Define the types for DOM elements
type RegisterForm = HTMLFormElement & {
  user_estimate: HTMLInputElement;
  role: HTMLSelectElement;
  company_name: HTMLInputElement;
  app_name: HTMLInputElement;
  app_desc: HTMLTextAreaElement;
  app_url: HTMLInputElement;
  app_launch_date: HTMLInputElement;
};

function simplifyingGettingApiKeySteps() {
  // only if it's dictionaryapi's website
  if (window.location.host !== "dictionaryapi.com") {
    return;
  }

  makeRegistrationFormSimpler();
  helpToCopyExistedKeys();

  function makeRegistrationFormSimpler() {
    if (window.location.href !== "https://dictionaryapi.com/register/index") {
      return;
    }

    const registerForm = document.getElementById("register-form") as RegisterForm | null;
    if (!registerForm) {
      return;
    }

    const button = generateSimplifyingButton();
    button.onclick = () => {
      fillRegistrationForm(registerForm);
      button.remove();
    };

    function generateSimplifyingButton(): HTMLButtonElement {
      const button = document.createElement("button");
      button.classList.add("mw-dic-sim-btn");
      button.innerHTML = `<div><div>Make registration simpler</div><small>by filling some fields with ready-made texts</small></div>`;
      document.body.appendChild(button);
      return button;
    }

    function fillRegistrationForm(registerForm: RegisterForm) {
      registerForm.user_estimate.value = "1";
      (registerForm.user_estimate.closest(".row") as HTMLElement)!.style.display = "none";

      registerForm.role.value = "Final User";
      (registerForm.role.closest(".row") as HTMLElement)!.style.display = "none";

      registerForm.company_name.value = "Personal Use";
      (registerForm.company_name.closest(".row") as HTMLElement)!.style.display = "none";

      registerForm.app_name.value = "MW's dic chrome extension";
      (registerForm.app_name.closest(".row") as HTMLElement)!.style.display = "none";

      registerForm.app_desc.value = "Merriam-Webster' dictionary extension for Chrome and any chromium based browser";
      (registerForm.app_desc.closest(".row") as HTMLElement)!.style.display = "none";

      registerForm.app_url.value = "https://chrome.google.com/webstore/detail/gmhgdiamihghcepkeapfoeakphffcdkk";
      (registerForm.app_url.closest(".row") as HTMLElement)!.style.display = "none";

      registerForm.app_launch_date.value = "06/01/2022";
      (registerForm.app_launch_date.closest(".row") as HTMLElement)!.style.display = "none";
    }
  }

  function helpToCopyExistedKeys() {
    if (window.location.href !== "https://dictionaryapi.com/account/my-keys") {
      return;
    }

    const apiKeyElements = document.querySelectorAll(".key-links");
    apiKeyElements.forEach((apiKeyElm: Element) => {
      const lbl = apiKeyElm.parentElement?.previousElementSibling;
      if (lbl && lbl.textContent) {
        const apiTypeName = lbl.textContent.replace(/.*\(/, "").replace(/\).*/, "") as keyof typeof API_TYPES;
        const apiType = API_TYPES[apiTypeName];
        if (apiType && apiKeyElm.textContent) {
          addHelpersToUseKey(apiKeyElm, apiType, apiKeyElm.textContent);
        }
      }
    });
  }

  function addHelpersToUseKey(apiKeyElm: Element, apiType: OptionsType["apiType"], apiKey: string) {
    const button = document.createElement("button");
    button.innerText = "Use this key";
    apiKeyElm.after(button);

    button.onclick = (event: MouseEvent) => setKeyOnBtnClick(apiType, apiKey, event);
  }

  async function setKeyOnBtnClick(apiType: OptionsType["apiType"], apiKey: string, event: MouseEvent) {
    await sendGlobalMessage({
      action: GlobalActionTypes.UPDATE_OPTIONS,
      data: {
        apiKey,
        apiType
      }
    });
    const target = event.target as HTMLButtonElement;
    target.innerText = "Done!";
  }
}

export default simplifyingGettingApiKeySteps;
