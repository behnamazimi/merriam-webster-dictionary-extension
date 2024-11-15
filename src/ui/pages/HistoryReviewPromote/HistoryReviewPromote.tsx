import React, { useEffect } from "react";
import { sendGlobalMessage, sendMessageToCurrentTab } from "../../../utils/messaging";
import { GlobalActionTypes } from "../../../types";
import { Box, Button, Code, Group, Image, Text, Title } from "@mantine/core";

type HistoryReviewPromoteProps = {
  historySample?: string;
};

// TODO: Fix Vite HMR with named function components and name this component properly
// eslint-disable-next-line react/display-name
export default function ({ historySample }: HistoryReviewPromoteProps) {
  useEffect(() => {
    sendMessageToCurrentTab({
      action: GlobalActionTypes.MAKE_CONTENT_IFRAME_VISIBLE,
      data: {
        targetScreen: "REVIEW_PROMOTE",
        width: 450,
        height: document.body.scrollHeight
      }
    });
  }, []);

  return (
    <Box p="md">
      <Group wrap="nowrap" gap="xs" mb="sm">
        <div>
          <Title order={4}>
            Review your search history!
          </Title>
          <p className="message">
            You've previously searched for the meaning of
            <Code mx="4">{historySample}</Code>
            found on this page.
          </p>
        </div>
        <Image w={90} radius="md" src="/icon/128.png" alt="" />
      </Group>

      <Text>
        Do you want to enable review mode, so you can see your relevant history
        in the bottom corner of each page?
      </Text>

      <Group justify="center" align="center" mt="md">
        <Button
          onClick={async () => {
            await sendGlobalMessage({
              action: GlobalActionTypes.UPDATE_OPTIONS,
              data: {
                isRelativeHistoryPromoted: true,
                reviewMode: false
              }
            });
            await sendMessageToCurrentTab({
              action: GlobalActionTypes.CLOSE_IFRAME,
              data: {
                targetScreen: "REVIEW_PROMOTE"
              }
            });
          }}
          variant="outline"
        >
          No, thanks!
        </Button>
        <Button
          onClick={async () => {
            await sendGlobalMessage({
              action: GlobalActionTypes.UPDATE_OPTIONS,
              data: {
                isRelativeHistoryPromoted: true,
                reviewMode: true
              }
            });
            await sendMessageToCurrentTab({
              action: GlobalActionTypes.CLOSE_IFRAME,
              data: {
                targetScreen: "REVIEW_PROMOTE"
              }
            });
          }}
        >
          Enable now
        </Button>
      </Group>
    </Box>
  );
};
