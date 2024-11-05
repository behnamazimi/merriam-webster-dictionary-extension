import React, { FC, useEffect } from "react";
import { sendGlobalMessage, sendMessageToCurrentTab } from "@/shared/utils/messaging";
import { globalActions } from "@/shared/utils/constants";
import "./OnPageHistoryPromotion.css";

const OnPageHistoryPromotion: FC<{ historySample?: string }> = ({ historySample }) => {
  useEffect(() => {
    sendMessageToCurrentTab({
      action: globalActions.MAKE_CONTENT_IFRAME_VISIBLE,
      data: {
        targetScreen: "REVIEW_PROMOTE",
        width: 450,
        height: document.body.scrollHeight
      }
    });
  }, []);

  return (
    <div className="OnPageHistoryPromotion">
      <div className="details">
        <h3 className="title">
          Review your search history!
        </h3>
        <p className="message">
          You've previously searched for the meaning of
          <code>{historySample}</code>
          found on this page.
        </p>
        <img src="/icons/128.png" className="logo" alt="" />
      </div>

      <p className="message">
        Do you want to enable review mode, so you can see your relevant history
        in the bottom corner of each page?
      </p>

      <div className="actions">
        <button
          className="close"
          id="close-promotion"
          onClick={async () => {
            await sendGlobalMessage({
              action: globalActions.SET_OPTIONS,
              data: {
                isRelativeHistoryPromoted: true,
                reviewMode: false,
                closeReviewPromotion: true
              }
            });
          }}
        >
          Close
        </button>
        <button
          id="enable-review-mode"
          onClick={async () => {
            await sendGlobalMessage({
              action: globalActions.SET_OPTIONS,
              data: {
                isRelativeHistoryPromoted: true,
                reviewMode: true,
                closeReviewPromotion: true
              }
            });
          }}
        >
          Enable now
        </button>
      </div>
    </div>
  );
};

export default OnPageHistoryPromotion;
