import React from "react";
import ReactDOM from "react-dom/client";
import Bubble from "./pages/content/Bubble";
import { services } from "./shared/utils/services";
import { sendGlobalMessage } from "./shared/utils/messaging";
import { GlobalActionTypes, IframeContext } from "./types";
import OnPageHistoryPromotion from "./pages/content/components/OnPageHistoryPromotion";
import OnPageHistoryBar from "./pages/content/components/OnPageHistoryBar";
import "chota/dist/chota.min.css";

/**
 * Get the context from the window.name
 * It is used to pass the search trend and target screen from the parent window
 */
const getParsedIframeContext = (): IframeContext => {
  const context = window.name;
  try {
    return JSON.parse(context || "{}");
  }
  catch {
    return {};
  }
};

const initialize = async () => {
  const response = await sendGlobalMessage({ action: GlobalActionTypes.CONTENT_INIT });
  // set api key and type in utils
  services.setAuth(response.options.apiKey, response.options.apiType);
  const { searchTrend, targetScreen = "LOOKUP_RESULT", historySample } = getParsedIframeContext();

  let root = document.getElementById("root");
  if (!root) {
    root = document.createElement("div");
    root.id = "root";
    document.body.appendChild(root);
  }
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      {targetScreen === "REVIEW_PROMOTE" && (
        <OnPageHistoryPromotion historySample={historySample} />
      )}
      {targetScreen === "REVIEW" && (
        <OnPageHistoryBar />
      )}
      {targetScreen === "LOOKUP_RESULT" && (
        <Bubble defaultSearchTrend={searchTrend} />
      )}
    </React.StrictMode>
  );
};

initialize().catch(console.error);
