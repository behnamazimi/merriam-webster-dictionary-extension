import React from "react";
import ReactDOM from "react-dom/client";
import { GlobalActionTypes, IframeContext } from "../../types";
import { sendGlobalMessage } from "../../utils/messaging";
import { services } from "../../utils/services";
import HistoryReviewPromote from "../pages/HistoryReviewPromote";
import HistoryReview from "../pages/HistoryReview/HistoryReview";
import ContentBubble from "../pages/ContentBubble/ContentBubble";
import { ThemeProvider } from "../theme";

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
  const response = await sendGlobalMessage({ action: GlobalActionTypes.INIT_CONTENT });
  // set api key and type in utils
  services.setAuth(response.options.apiKey, response.options.apiType);

  // set text size
  if (response.options.textSize) {
    document.documentElement.style.fontSize = response.options.textSize;
  }

  const { searchTrend, targetScreen = "LOOKUP_RESULT", historySample } = getParsedIframeContext();

  let root = document.getElementById("root");
  if (!root) {
    root = document.createElement("div");
    root.id = "root";
    document.body.appendChild(root);
  }
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <ThemeProvider colorScheme={response.options.theme || "auto"}>
        {targetScreen === "REVIEW_PROMOTE" && (
          <HistoryReviewPromote historySample={historySample} />
        )}
        {targetScreen === "REVIEW" && (
          <HistoryReview />
        )}
        {targetScreen === "LOOKUP_RESULT" && (
          <ContentBubble defaultSearchTrend={searchTrend} textSize={response.options.textSize} />
        )}
      </ThemeProvider>
    </React.StrictMode>
  );
};

initialize().catch(console.error);
