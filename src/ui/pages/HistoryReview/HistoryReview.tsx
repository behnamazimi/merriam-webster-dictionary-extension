import { FiX } from "react-icons/fi";
import { sendMessageToCurrentTab } from "../../../utils/messaging.js";
import React, { useEffect, useRef, useState } from "react";
import { GlobalActionTypes } from "../../../types";
import { ActionIcon, Anchor, Group } from "@mantine/core";

// TODO: Fix Vite HMR with named function components and name this component properly
// eslint-disable-next-line react/display-name
export default function () {
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
        width: (barRef.current?.scrollWidth || 0) + 15,
        height: barRef.current?.scrollHeight || 0
      }
    });
  }, [items]);

  return (
    <Group ref={barRef} justify="flex-start" align="center" px={2} w="auto" wrap="nowrap">
      <ActionIcon
        title="Close review bar"
        size="sm"
        ml="2"
        onClick={() => {
          sendMessageToCurrentTab({
            action: GlobalActionTypes.CLOSE_IFRAME,
            data: {
              targetScreen: "REVIEW"
            }
          });
        }}
      >
        <FiX />
      </ActionIcon>
      <span>Review: </span>
      {items.map((item, key) => (
        <Anchor
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
          {item.toLowerCase()}
        </Anchor>
      ))}
    </Group>
  );
};
