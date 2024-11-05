import { FiX } from "react-icons/fi";
import { sendMessageToCurrentTab } from "../../../shared/utils/messaging.js";
import React, { FC, useEffect, useRef, useState } from "react";
import "./OnPageHistoryBar.css";
import { GlobalActionTypes } from "../../../types";

const OnPageHistoryBar: FC = () => {
  const [items, setItems] = useState<string[]>([]);
  const barRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    sendMessageToCurrentTab({
      action: GlobalActionTypes.GET_PAGE_RELATIVE_HISTORY
    }).then((data) => {
      if (data?.pageHistory && Array.isArray(data.pageHistory)) {
        setItems(data.pageHistory);
      }
    });
  }, []);

  useEffect(() => {
    sendMessageToCurrentTab({
      action: GlobalActionTypes.MAKE_CONTENT_IFRAME_VISIBLE,
      data: {
        targetScreen: "REVIEW",
        width: barRef.current?.scrollWidth || 0,
        height: Math.max(barRef.current?.scrollHeight || 0, 32)
      }
    });
  }, [items]);

  return (
    <div className="OnPageHistoryBar" ref={barRef}>
      <button
        className="disable"
        id="disable-review-mode"
        title="Close review bar"
        onClick={() => {
          // TODO: Implement this
        }}
      >
        <FiX />
      </button>
      <span>Things to review: </span>
      {items.map((item, key) => (
        <button
          className="word"
          data-searchfor={item}
          key={key}
          onClick={async () => {
            await sendMessageToCurrentTab({
              action: GlobalActionTypes.OPEN_LOOKUP_RESULT,
              data: {
                searchFor: item
              }
            });
          }}
        >
          {item}
        </button>
      ))}
    </div>
  );
};

export default OnPageHistoryBar;
