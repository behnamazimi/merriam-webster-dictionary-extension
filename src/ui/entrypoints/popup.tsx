import React from "react";
import ReactDOM from "react-dom/client";
import Popup from "../pages/Popup";
import { ThemeProvider } from "../theme";
import { sendGlobalMessage } from "../../utils/messaging";
import { GlobalActionTypes } from "../../types";
import { services } from "../../utils/services";

const initialize = async () => {
  const response = await sendGlobalMessage({ action: GlobalActionTypes.INIT_POPUP });
  // set api key and type in utils
  services.setAuth(response.options.apiKey, response.options.apiType);

  const root = document.getElementById("root") as HTMLElement;
  if (!root) {
    const root = document.createElement("div");
    root.id = "root";
    document.body.appendChild(root);
  }

  // set text size
  if (response.options.textSize) {
    document.documentElement.style.fontSize = response.options.textSize;
    if (response.options.textSize === "18px") {
      document.body.style.width = "420px";
    }
    else {
      document.body.style.width = "380px";
    }
  }

  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <ThemeProvider colorScheme={response.options.theme || "auto"}>
        <Popup />
      </ThemeProvider>
    </React.StrictMode>
  );
};

initialize().catch(console.error);
